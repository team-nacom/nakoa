import Guide, {GuideDocument} from '../models/guide';
import User from '../models/user';
import Count from '../models/count';
import createError from "http-errors";
import { UserDocument } from '../models/user';

// type guard
function isGuideDocument(obj: any): obj is GuideDocument{
  const guide = obj as GuideDocument;
  const keys = ['name', 'content'];

  // TODO properly check types & contents
  // TODO check exercises
  let result: boolean = keys.every((val: string) => (val in guide));

  // tentative; approve iff one author
  result = result && ("authors" in guide) && guide.authors.length === 1;

  return result;
}

export async function postOneGuide(guideObj: any, user: UserDocument) {
  guideObj.index ??= await Count.getNextCount('guide');
  guideObj.writer = user._id

  if(!isGuideDocument(guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else if(await Guide.exists({ index: guideObj.index })){
    throw createError(400, `Guide with index ${guideObj.index} already exists`);
  }
  else {
    const guide = new Guide(guideObj);

    await guide.save();
    await User.findByIdAndUpdate(user._id,{ '$push': { 'guides': guide._id } });
    console.log(`Guide upload "${guide.name}" successful`);
    return guide;
  }
}

export async function updateOneGuide(guideObj: any, index: number, user: UserDocument) {
  if(index !== guideObj.index) throw createError(400, "Index does not match with URI");
  const guide = await Guide.findOne({ index: guideObj.index }).exec();

  // TODO check if extra fields exist
  if(! ("index" in guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else if(guide === null) {
    throw createError(401, `Guide with index ${guideObj.index} doesn't exist`);
  } else if(!guide.hasWriteAuthority(user)) {
    throw createError(401, `User ${user.email} is unauthorized to update guide ${guide.index}`);
  }
  else {
    
    await Guide.findOneAndUpdate({ index: guideObj.index }, { $set: guideObj }, { runValidators: true }).exec();

    console.log(`Guide update "${guide.name}" successful`);
  }
}
