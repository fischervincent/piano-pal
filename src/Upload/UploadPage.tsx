import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { extractMusicXML, parseMusicXMLToProgram } from "@/Upload/xml-to-program-parser";
import { TrainingProgram } from "@/trainingProgram/trainingPrograms";

const createTrainingProgramFromFile = async (file: File): Promise<TrainingProgram> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'mxl') {
    const xmlContent = await extractMusicXML(file);
    return await parseMusicXMLToProgram(xmlContent);
  } else if (extension === 'xml') {
    const text = await file.text();
    return await parseMusicXMLToProgram(text);
  } else {
    throw new Error('Unsupported file format. Please upload a .xml or .mxl file.');
  }
}


export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if(files?.length !== 1) {
      alert("Please upload a single file.");
      return;
    }
    const file = files?.[0];
    const newProgram = await createTrainingProgramFromFile(file)
    console.log("New program created from file:", newProgram);
    console.log({notes: newProgram.notes})
    alert("Not implemented yet, sorry");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Upload a MIDI or MusicXML File
      </h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        We’ll generate an interactive session based on your upload.
      </p>

      <div
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center transition-colors duration-200 cursor-pointer ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-card hover:shadow-md"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag & drop a MIDI or MusicXML file, or
        </p>
        <Button variant="outline" size="lg">
          Choose File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mid,.midi,.xml,.musicxml"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
