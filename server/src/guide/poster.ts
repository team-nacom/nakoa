import Guide, {GuideDocument} from '../models/guide';
import Count from '../models/count';
import createError from "http-errors";

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

export async function postOneGuide(guideObj: any, user: any) {
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
    //@ts-ignore
    await User.findByIdAndUpdate(user._id,{ '$push': { 'guides': guide._id } });
    console.log(`Guide upload "${guide.name}" successful`);
    return guide;
  }
}
