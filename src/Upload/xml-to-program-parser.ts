import { TrainingProgram } from '@/trainingProgram/trainingPrograms';
import { XMLParser } from 'fast-xml-parser';
import { v4 as uuidv4 } from 'uuid';
import { unzipSync } from 'fflate';
import { NoteWithHand } from '@/trainingProgram/notes';

export const extractMusicXML = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const unzipped = unzipSync(buffer);

      // Locate the MusicXML file in the archive
      let xmlContent: string | undefined;
      for (const name in unzipped) {
        if (name.endsWith('.xml') && name !== 'META-INF/container.xml') {
          const xmlBuffer = unzipped[name];
          xmlContent = new TextDecoder().decode(xmlBuffer);
          break;
        }
      }

      if (xmlContent) {
        resolve(xmlContent);
      } else {
        reject('No .xml file found inside .mxl');
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

const returnTrueIfInAnotherHand = (noteMap: Map<string, NoteWithHand>, hand: string | undefined, noteName: string, octave: string): boolean => {
  if(hand) return false;
  const noteKeyIfLeft = `${noteName}${octave}-left`;
  const noteKeyIfRight = `${noteName}${octave}-right`;
  const isInLeft = noteMap.has(noteKeyIfLeft);
  const isInRight = noteMap.has(noteKeyIfRight);
  return isInLeft || isInRight;
}

export const parseMusicXMLToProgram = (xml: string): TrainingProgram => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  // Assuming your XML has the right format, typically like <score-partwise>
  const scorePartwise = parsed['score-partwise'];
  if (!scorePartwise) throw new Error('No score-partwise found in MusicXML');

  const part = parsed['score-partwise']?.part;
  console.log("parsed", parsed)
  console.log("part", part)
  if (!part) throw new Error('No part found in MusicXML');

  const measures = Array.isArray(part.measure) ? part.measure : [part.measure];

  const noteMap = new Map<string, NoteWithHand>();
  for (const measure of measures) {
    // Process each measure
    const notes = Array.isArray(measure.note) ? measure.note : [measure.note];
    notes.forEach((note) => {
      if (note.rest) return; // Skip rests

      const pitch = note.pitch;
      if (!pitch) return;

      const { step, octave, alter } = pitch;
      let noteName = step;
      if (alter === -1) noteName = step + 'b';
      else if (alter === 1) noteName = step + '#';

      // Determine the hand based on the stem
      const stem = note.stem;
      let hand: 'left' | 'right' | undefined = undefined;
      if (stem === 'down') {
        hand = 'left'; // Stem down usually means left hand
      } else if (stem === 'up') {
        hand = 'right'; // Stem up usually means right hand
      }
      const noteKey = `${noteName}${octave}-${hand}`;  // Unique key for each note-hand pair

      // Store the note-hand pair in the Map (duplicates are automatically avoided)
      if (!noteMap.has(noteKey) && !returnTrueIfInAnotherHand(noteMap, hand, noteName, octave)) {
        noteMap.set(noteKey, { note: `${noteName}${octave}`, hand });
      }
    });
  }

  const uniqueNotes = Array.from(noteMap.values());
  return {
    id: uuidv4(),
    name: 'Imported Program',
    description: 'Imported from MusicXML file.',
    difficulty: 'Custom',  // You can add logic to derive difficulty based on XML content
    notes: uniqueNotes,
    notesToStartWith: uniqueNotes.slice(0, 4),
  };
};
