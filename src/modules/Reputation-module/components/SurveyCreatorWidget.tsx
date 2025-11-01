import React, { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { ICreatorOptions } from "survey-creator-core";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

interface SurveyCreatorWidgetProps {
  initialJSON?: any;
  onSave: (json: any) => void;
  readOnly?: boolean;
}

export const SurveyCreatorWidget: React.FC<SurveyCreatorWidgetProps> = ({
  initialJSON,
  onSave,
  readOnly = false,
}) => {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  useEffect(() => {
    const creatorOptions: ICreatorOptions = {
      showLogicTab: true,
      showTranslationTab: false,
      isAutoSave: false,
      showJSONEditorTab: false,
      showDesignerTab: true,
      showPreviewTab: true,
      showEmbeddedSurveyTab: false,
      readOnly: readOnly,
    };

    const instance = new SurveyCreator(creatorOptions);

    // Load initial JSON if provided
    if (initialJSON) {
      instance.JSON = initialJSON;
    } else {
      // Default empty survey
      instance.JSON = {
        pages: [
          { name: "page1", elements: [] },
        ],
      };
    }

    // Listen for changes
    instance.onModified.add(() => {
      if (!readOnly) {
        onSave(instance.JSON);
      }
    });

    setCreator(instance);

    return () => {
      instance.dispose();
      setCreator(null);
    };
  }, [initialJSON, onSave, readOnly]);

  return (
    <div className="survey-creator-container">
      {creator && (
        <SurveyCreatorComponent creator={creator} />
      )}
    </div>
  );
};
