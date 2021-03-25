import Guide, {GuideDocument} from '../models/guide';
import Count from '../models/count';
import createError from "http-errors";

export async function postOneGuide(guideObj: any) {
  // type guard
  function isGuideDocument(obj: any): obj is GuideDocument{
    const quiz = obj as GuideDocument;
    const keys = ['name', 'content', 'priority'];
    // TODO properly check types & contents
    let result: boolean = keys.every((val: string) => (val in quiz));
    return result;
  }
  // TODO check exercises

  guideObj.index ??= await Count.getNextCount('guide');

  if(await Guide.exists({ index: guideObj.index })){
    throw createError(400, `Guide with index ${guideObj.index} already exists`);
  }
  else if(!isGuideDocument(guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else {
    const guide = new Guide(guideObj);
    
    await guide.save();
    console.log(`Guide upload "${guide.name}" successful`);
  }
}
