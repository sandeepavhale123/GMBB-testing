import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CreateQAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (question: string, answer: string) => void;
}

export const CreateQAModal: React.FC<CreateQAModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { t } = useI18nNamespace("QA/createQAModal");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (question.trim() && answer.trim()) {
      onSubmit(question, answer);
      setQuestion("");
      setAnswer("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("createQAModal.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question">{t("createQAModal.questionLabel")}</Label>
            <Input
              id="question"
              placeholder={t("createQAModal.questionPlaceholder")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">{t("createQAModal.answerLabel")}</Label>
            <Textarea
              id="answer"
              placeholder={t("createQAModal.answerPlaceholder")}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("createQAModal.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("createQAModal.submit")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
