import { SetStateAction } from "react";
import SignatureCanvas from "react-signature-canvas";

export interface SettingsInterface {
  bgColor?: string;
  penWidth?: number;
  penColor?: string;
}

export interface OptionsInterface {
  clear?: boolean;
  undo?: boolean;
  backgroundColorOption?: boolean;
  penColorOption?: boolean;
  penWidthOption?: boolean;
}

export interface SignatureInterface {
  sign: SignatureCanvas | undefined | null;
  handleClear: (deletePoints: boolean) => void;
  handleUndo: () => void;
  settings: SettingsInterface;
  setSettings: React.Dispatch<SetStateAction<SettingsInterface>>;
  saveCallback: (lastPoint: string) => void;
  enabledOptions: OptionsInterface | undefined;
  points: string[];
}
