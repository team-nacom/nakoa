import Guide, {GuideDocument} from '../models/guide';
import createError from "http-errors";
import AdmZip from "adm-zip";

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

  guideObj.index ??= -1;

  if(await Guide.exists({ index: guideObj.index })){
    throw createError(400, `Guide with index ${guideObj.index} already exists`);
  }
  else if(!isGuideDocument(guideObj)){
    throw createError(400, "Guide is ill-formed");
  }
  else {
    const guide = new Guide(guideObj);
    
    await guide.save()
      .then(() => { console.log(`Guide upload "${guide.name}" successful`); })
      .catch(err => { console.error(err); throw createError(500, err); });
  }
}

// export async function postZipFile(){

// }