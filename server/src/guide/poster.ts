import Guide, {GuideDocument} from '../models/guide';
import Count from '../models/count';
import createError from "http-errors";

// type guard
function isGuideDocument(obj: any): obj is GuideDocument{
  const guide = obj as GuideDocument;
  const keys = ['name', 'content', 'priority'];

  // TODO properly check types & contents
  // TODO check exercises
  let result: boolean = keys.every((val: string) => (val in guide));
  return result;
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
    
    await guide.save();
    console.log(`Guide upload "${guide.name}" successful`);
  }
}

export async function updateOneGuide(guideObj: any, index: number) {
  if(index !== guideObj.index) throw createError(400, "Index does not match with URI");
  const guide = await Guide.findOne({ index: guideObj.index }).exec();

  // TODO check if extra fields exist
  if(! ("index" in guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else if(guide === null) {
    throw createError(401, `Guide with index ${guideObj.index} doesn't exist`);
  }
  else {
    await Guide.findOneAndUpdate({ index: guideObj.index }, { $set: guideObj }, { runValidators: true }).exec();

    console.log(`Guide update "${guide.name}" successful`);
  }
}
