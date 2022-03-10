import React from "react";
import createPdf from "./createPdf";

interface Props {
  pdfElementRef: React.RefObject<HTMLDivElement>;
  fileName?: string;
}

function CreatePdfButton({ pdfElementRef, fileName = 'document.pdf' }: Props) {
  const [disabled, setDisabled] = React.useState<boolean>(false);

  return (
    <button disabled={disabled} onClick={async () => {
      setDisabled(true);
      const pdfElement = pdfElementRef.current;
      if (!pdfElement) {
        alert('인쇄할 문서가 없습니다.');
        return;
      }
      await createPdf(pdfElement, fileName);
      setDisabled(false);
    }}>
      Create PDF File
    </button>
  )
}

export default CreatePdfButton;