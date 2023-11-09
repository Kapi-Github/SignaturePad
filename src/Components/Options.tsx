import { useContext, useEffect, useMemo, useState } from "react";
import { SignatureContext } from "../App";
import { SettingsInterface } from "../Interfaces/Signatureinterfaces";

const themes = {
  button: `px-[4px] py-[2px] rounded-[4px] flex gap-[10px] items-center mx-[10px] hover:bg-gray-200 transition-all duration-150 ease-in-out`,
};

const Options = () => {
  const [openSettings, setOpenSettings] = useState<boolean>();
  const {
    sign,
    handleClear,
    handleUndo,
    settings,
    setSettings,
    saveCallback,
    enabledOptions,
    points,
  } = useContext(SignatureContext);

  const [newSettings, setNewSettings] = useState<SettingsInterface>({
    bgColor: settings.bgColor ? settings.bgColor : "255,255,255",
    penWidth: settings.bgColor ? settings.penWidth : 3,
    penColor: settings.penColor ? settings.penColor : "0,0,0",
  });

  const isChanged = useMemo(() => {
    return JSON.stringify(settings) === JSON.stringify(newSettings)
      ? false
      : true;
  }, [settings, newSettings]);

  const clearCanvas = () => {
    handleClear(true);
    setOpenSettings(false);
  };

  const handleColor = (
    event: React.FormEvent<HTMLInputElement>,
    key: string
  ) => {
    const color = (event.target as HTMLInputElement).value;
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const finalColor = `${r},${g},${b}`;
    setNewSettings((prev: SettingsInterface) => {
      return { ...prev, [key]: finalColor };
    });
  };

  const handlePenSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(event.target.value);
    if (size >= 1 && size <= 10) {
      setNewSettings((prev) => {
        return {
          ...prev,
          penWidth: parseInt(event.target.value),
        };
      });
    }
  };

  const handleSetSettingsClick = () => {
    setSettings(newSettings);
    setOpenSettings(false);
  };

  const sendData = () => {
    const lastPoint = sign?.toDataURL();
    setOpenSettings(false);

    if (points.length > 0) {
      lastPoint && saveCallback(lastPoint);
    }
  };

  const resetSettings = () => {
    setSettings({
      bgColor: "255,255,255",
      penWidth: 3,
      penColor: "0,0,0",
    });
    setOpenSettings(false);
  };

  const rgbToHex = (color: string | undefined): string => {
    const colors: string[] | undefined = color?.split(",");
    let hexColor = "";
    colors &&
      colors.map((element) => {
        hexColor += parseInt(element).toString(16);
        if (hexColor.length % 2 !== 0) {
          hexColor += "0";
        }
      });

    return "#" + hexColor;
  };

  useEffect(() => {
    setSettings({
      bgColor: "255,255,255",
      penWidth: 3,
      penColor: "0,0,0",
    });
    const handler = (event: MouseEvent) => {
      const color = event.target as HTMLElement;
      if (color.tagName === "CANVAS") {
        setOpenSettings(false);
      }
    };

    addEventListener("click", handler);

    return () => {
      removeEventListener("click", handler);
    };
  }, []);

  return (
    <div className={`absolute z-50 pl-[20px] pb-[20px]`}>
      <div className={`relative`}>
        <button
          className={`h-[25px] bg-white px-[10px] border-l-[1px] border-b-[1px] border-gray-400 rounded-bl-[4px]`}
          onClick={() => setOpenSettings((prev) => !prev)}
        >
          <span className={`text-[1rem]`}>Options</span>
        </button>
        <div
          className={`absolute options bg-white shadow-[0_18px_24px_-11px_rgb(26,32,44)] border-[1px] border-gray-200 rounded-[5px] flex flex-col gap-[5px] py-[5px] top-[30px] right-0 opacity-0 pointer-events-none transition-all duration-200 ease-out min-w-[150px] ${
            openSettings && "opacity-100 pointer-events-auto"
          }`}
        >
          {enabledOptions?.clear && (
            <button
              className={`${themes.button}`}
              onClick={() => clearCanvas()}
            >
              <div className={`px-[5px]`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M15.963 7.23A8 8 0 0 1 .044 8.841a.75.75 0 0 1 1.492-.158a6.5 6.5 0 1 0 9.964-6.16V4.25a.75.75 0 0 1-1.5 0V0h4.25a.75.75 0 0 1 0 1.5h-1.586a8.001 8.001 0 0 1 3.299 5.73ZM7 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm-2.25.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0ZM1.5 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Clear</span>
            </button>
          )}
          {enabledOptions?.undo && (
            <button className={`${themes.button}`} onClick={() => handleUndo()}>
              <div className={`px-[5px]`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7.18 4L8.6 5.44L6.06 8h9.71a6 6 0 0 1 0 12h-2v-2h2a4 4 0 0 0 0-8H6.06l2.54 2.51l-1.42 1.41L2.23 9Z"
                  />
                </svg>
              </div>
              <span>Undo</span>
            </button>
          )}
          {enabledOptions?.backgroundColorOption && (
            <>
              <hr />
              <div className={`mx-[10px] flex items-center gap-[5px]`}>
                <input
                  type="color"
                  defaultValue={rgbToHex(newSettings.bgColor)}
                  className={`w-[40px] cursor-pointer`}
                  onChange={(event) => handleColor(event, "bgColor")}
                />
                <span>Background</span>
              </div>
            </>
          )}
          {enabledOptions?.penColorOption && (
            <div className={`mx-[10px] flex items-center gap-[5px]`}>
              <input
                type="color"
                defaultValue={rgbToHex(newSettings.penColor)}
                className={`w-[40px] cursor-pointer`}
                onChange={(event) => handleColor(event, "penColor")}
              />
              <span>Pen color</span>
            </div>
          )}
          {enabledOptions?.penWidthOption && (
            <>
              <div className={`mx-[10px] flex items-center gap-[5px]`}>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newSettings.penWidth}
                  onChange={handlePenSize}
                  className={`w-[40px] outline-none border-gray-200 border-[1px]`}
                />
                <span className={`w-[60%]`}>Pen width</span>
              </div>
              <hr />
            </>
          )}
          {(enabledOptions?.backgroundColorOption ||
            enabledOptions?.penWidthOption ||
            enabledOptions?.penColorOption) && (
            <>
              <button
                className={`${themes.button} ${isChanged && "bg-sky-200"}`}
                onClick={() => handleSetSettingsClick()}
              >
                Save settings
              </button>
              <button
                className={`${themes.button} bg-white`}
                onClick={() => resetSettings()}
              >
                Reset settings
              </button>
              <hr />
            </>
          )}
          <button
            className={`${themes.button} bg-white`}
            onClick={() => sendData()}
          >
            Send
          </button>
          <button
            className={`${themes.button} bg-white`}
            onClick={() => setOpenSettings(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Options;
