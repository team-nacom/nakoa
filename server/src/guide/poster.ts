import Guide, {GuideDocument} from '../models/guide';
import createError from "http-errors";

export async function postOneGuide(guideObj: any) {
  // type guard
  function isGuideDocument(obj: any): obj is GuideDocument{
    const quiz = obj as GuideDocument;
    const keys = ['name', 'content', 'priority', 'authors'];
    // TODO properly check types & contents
    let result: boolean = keys.every((val: string) => (val in quiz));
    return result;
  }
  // TODO check exercises

  guideObj.index ??= -1;

  if(await Guide.exists({ index: guideObj.index })){
    throw createError(400, `Guide with index ${guideObj.index} already exists`);
  }
  else if(!isGuideDocument(guideObj)){
    throw createError(400, "Invalid Guide format");
  }
  else {
    const guide = new Guide(guideObj);
    
    await guide.save();
    console.log(`Guide "${guide.name}" uploaded successful`);
  }
}

// export async function postZipFile(){

// }