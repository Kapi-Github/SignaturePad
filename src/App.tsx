import { createContext, useEffect, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import Options from "./Components/Options";
import {
  SettingsInterface,
  SignatureInterface,
  OptionsInterface,
} from "./Interfaces/Signatureinterfaces";

export const SignatureContext = createContext<SignatureInterface>(
  {} as SignatureInterface
);

interface Props {
  saveCallback: (lastPoint: string) => void;
  options?: OptionsInterface;
}

function App({ saveCallback, options }: Props) {
  const [enabledOptions, setEnabledOptions] = useState<OptionsInterface>({
    clear: true,
    undo: true,
    backgroundColorOption: true,
    penWidthOption: true,
    penColorOption: true,
  });
  const [sign, setSign] = useState<ReactSignatureCanvas | null>();
  const [settings, setSettings] = useState<SettingsInterface>({
    bgColor: "255,255,255",
    penWidth: 3,
    penColor: "0,0,0",
  });

  useEffect(() => {
    if (options) {
      let optionsObject = {
        clear: true,
        undo: true,
        backgroundColorOption: true,
        penWidthOption: true,
        penColorOption: true,
      };

      Object.keys(enabledOptions).forEach((el) => {
        if (Object.keys(options).find((key) => el === key)) {
          optionsObject = {
            ...optionsObject,
            [el]: options[el as keyof OptionsInterface],
          };
        }
      });
      setEnabledOptions(optionsObject);
    }
  }, []);

  const [points, setPoints] = useState<string[]>([]);

  const handleClear = (deletePoints: boolean) => {
    if (!sign?.isEmpty()) {
      if (deletePoints) {
        setPoints([]);
      }
      sign?.clear();
    }
  };

  const handleUndo = () => {
    if (points.length > 0) {
      points.length === 1 &&
        setSettings({
          bgColor: "255,255,255",
          penWidth: 3,
          penColor: "0,0,0",
        });
      points.pop();
      handleClear(false);
      sign?.fromDataURL(points[points.length - 1]);
    } else {
      setPoints([]);
    }
  };

  useEffect(() => {
    const data = sign?.toData();
    handleClear(false);
    data && sign?.fromData(data);
    data &&
      setPoints((prev: string[]) => {
        const dataString = sign?.toDataURL();
        if (dataString) {
          return [...prev, dataString];
        } else return [...prev];
      });
  }, [settings.bgColor]);

  return (
    <div className={`flex flex-col w-[100%] h-[100%] items-end relative`}>
      <SignatureContext.Provider
        value={{
          sign,
          handleClear,
          handleUndo,
          settings,
          setSettings,
          saveCallback,
          enabledOptions,
          points,
        }}
      >
        <Options />
      </SignatureContext.Provider>
      <SignatureCanvas
        canvasProps={{
          width: window.innerWidth,
          height: window.innerHeight,
        }}
        backgroundColor={`rgb(${settings.bgColor})`}
        minWidth={settings.penWidth}
        maxWidth={settings.penWidth}
        penColor={`rgb(${settings.penColor})`}
        onEnd={() => {
          setPoints((prev: string[]) => {
            const dataString = sign?.toDataURL();
            if (dataString) {
              return [...prev, dataString];
            } else return [...prev];
          });
        }}
        ref={(data) => setSign(data)}
      />
    </div>
  );
}

export default App;
