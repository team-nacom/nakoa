import Guide, {GuideDocument} from '../models/guide';
import Cate from '../models/cate';
import Gory from '../models/gory';
import Count from '../models/count';
import createError from "http-errors";
import { UserDocument } from '../models/user';

// type guard
function isGuideDocument(obj: any): obj is GuideDocument{
  const guide = obj as GuideDocument;
  const keys = ['name', 'content', 'priority'];

  // TODO properly check types & contents
  // TODO check exercises
  let result: boolean = keys.every((val: string) => (val in guide));

  // tentative; approve iff one author
  result = result && ("authors" in guide) && guide.authors.length === 1;

  return result;
}

async function updateGory(guideIndex: number, toGoryIndex: string, fromGoryIndex?: string): Promise<boolean> {
  try {
    if(fromGoryIndex){
      await Gory.updateOne({index: fromGoryIndex}, {$pull: {guides: guideIndex}}).exec();
    }
    await Gory.updateOne({index: toGoryIndex}, {$push: {guides: guideIndex}}).exec();
  } catch(e) {
    console.error("Error while updating gory: " + e);
    return false;
  }
  return true;
}


export async function postOneGuide(guideObj: any) {
  guideObj.index ??= await Count.getNextCount('guide');

  if(!isGuideDocument(guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else if(await Guide.exists({ index: guideObj.index })){
    throw createError(400, `Guide with index ${guideObj.index} already exists`);
  }
  else {
    const guide = new Guide(guideObj);

    await updateGory(guideObj.index, guideObj.gory);

    await guide.save();
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
    await updateGory(guideObj.index, guideObj.gory, guide.gory);
    
    await Guide.findOneAndUpdate({ index: guideObj.index }, { $set: {content: guideObj.content, priority: guideObj.priority, isPublic: guideObj.isPublic, name: guideObj.name} }, { runValidators: true }).exec();

    console.log(`Guide update "${guide.name}" successful`);
  }
}
