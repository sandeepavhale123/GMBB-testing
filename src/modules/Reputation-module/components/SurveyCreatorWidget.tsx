import React, { useEffect, useRef } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { ICreatorOptions } from "survey-creator-core";
import "survey-core/survey.css";
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
  const creatorRef = useRef<SurveyCreator | null>(null);

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

    const creator = new SurveyCreator(creatorOptions);
    
    // Load initial JSON if provided
    if (initialJSON) {
      creator.JSON = initialJSON;
    } else {
      // Default empty survey
      creator.JSON = {
        pages: [
          {
            name: "page1",
            elements: [],
          },
        ],
      };
    }

    // Listen for changes
    creator.onModified.add(() => {
      if (!readOnly) {
        onSave(creator.JSON);
      }
    });

    creatorRef.current = creator;

    return () => {
      creator.dispose();
    };
  }, [initialJSON, onSave, readOnly]);

  return (
    <div className="survey-creator-container">
      {creatorRef.current && (
        <SurveyCreatorComponent creator={creatorRef.current} />
      )}
    </div>
  );
};
