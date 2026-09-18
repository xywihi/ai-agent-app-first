"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

export const CreateTags = ({
  getValues,
  setValue,
  reset,
}: {
  getValues: any;
  setValue: any;
  reset: any;
}) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setValue("tags", currentTags);
  }, [currentTags, setValue]);
  return (
    <div>
      {currentTags && currentTags.length > 0 && (
        <div className="flex items-center gap-2">
          {currentTags.map((tag, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 flex gap-2 items-center"
            >
              <div>{tag}</div>
              <div
                className="text-md"
                onClick={() =>
                  setCurrentTags((pre) => pre.filter((_, i) => i !== index))
                }
              >
                x
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Input
          ref={inputRef}
          id="portfolio-tags"
          type="text"
          placeholder="输入标签"
          className="h-10 max-w-40"
        />
        <div
          className="border border-gray-300 dark:border-gray-600 rounded-lg"
          onClick={() => {
            const currentTag = inputRef.current?.value;
            setCurrentTags((pre) => {
              if (pre.includes(currentTag as string)) return pre;
              return [...pre, currentTag as string];
            });
            inputRef.current!.value = "";
          }}
        >
          <Plus size={34} color="#888" />
        </div>
      </div>
    </div>
  );
};
