"use client";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateTask } from "./hooks/use-update-task";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/custom/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberWithUserEmailAndProfileType } from "@/types/members";
import Avatar from "@/components/avatar";
import { TASK_STATUS } from "@/constants/forms";
import { Project, Tag, TaskStatus } from "@/db/schema";
import ProjectIcon from "@/components/project/project-icon";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { statusNames } from "@/constants/status";
import MultiSelect from "@/components/custom/multi-select";
import { useCreateTag } from "@/hooks/tag/use-create-tag";
import { createUUID } from "@/util/uuid";

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  BACKLOG: <CircleDashedIcon className="size-[15px] text-pink-400" />,
  TODO: <CircleIcon className="size-[15px] text-red-400" />,
  IN_PROGRESS: <CircleDotDashedIcon className="size-[15px] text-yellow-400" />,
  IN_REVIEW: <CircleDotIcon className="size-[15px] text-blue-400" />,
  DONE: <CircleCheckIcon className="size-[15px] text-emerald-400" />,
};

type Props = {
  onClose?: () => void;
  workspaceMembers: MemberWithUserEmailAndProfileType[];
  projects: Project[];
  task: GetTaskUseCaseReturn;
  taskId: string;
  tags: Tag[];
};

type TagOption = {
  value: string;
  label: string;
};

export default function UpdateTaskForm({
  onClose,
  projects,
  taskId,
  workspaceMembers,
  task,
  tags,
}: Props) {
  const [tagsOptions, setTagsOptions] = useState<TagOption[]>([]);

  const { form, onSubmit, error, loading } = useUpdateTask({
    onCallback: () => {
      onClose?.();
    },
    taskId,
    task,
  });

  const { onSubmit: onCreateTag } = useCreateTag();

  const onCreateNewTag = (name: string) => {
    if (!name?.trim().length) return;
    const tag = tagsOptions.find(
      t => t.label.toLowerCase() === name.toLowerCase(),
    );
    if (tag) return toast.error("Tag already exists");
    const id = createUUID();
    const newTag = {
      value: id,
      label: name,
    };
    const taskTags =
      form.getValues("taskTags") || task.taskTags.map(t => t.tag.id);
    form.setValue("taskTags", [...taskTags, newTag.value]);
    setTagsOptions([...tagsOptions, newTag]);
    onCreateTag(id, name);
  };

  useEffect(() => {
    setTagsOptions(tags.map(e => ({ value: e.id, label: e.name })));
  }, [tags]);

  const [animated] = useAutoAnimate();

  return (
    <Form {...form}>
      <form
        ref={animated}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Task name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description..."
                  className="w-full resize-none"
                  rows={4}
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  onChange={field.onChange}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>Optional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DatePicker control={form.control} label="Due date" name="dueDate" />
        <FormField
          control={form.control}
          name="assignedToMemberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full h-11 dark:!bg-shark-900/60 bg-shark-50 rounded-sm">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workspaceMembers.map(m => (
                    <SelectItem value={m.id} key={m.id}>
                      <div className="w-full flex items-center gap-2">
                        <div>
                          <Avatar
                            className="size-7"
                            alt={`${m.user.profile.displayName}`}
                            profile={m.user.profile}
                          />
                        </div>
                        <p className="text-sm font-medium">
                          {m.user.profile.displayName}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize w-full h-11 dark:!bg-shark-900/60 bg-shark-50 rounded-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TASK_STATUS.map((m, i) => {
                    const icon = statusIcons[m as TaskStatus];
                    const name = statusNames[m as TaskStatus];
                    return (
                      <SelectItem value={m} key={`${m}-${i}`}>
                        <div className="capitalize flex items-center gap-2 flex-1">
                          <div>{icon}</div>
                          <p className="text-sm font-medium capitalize">
                            {name.toLowerCase()}
                          </p>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full h-11 dark:!bg-shark-900/60 bg-shark-50 rounded-sm">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem value={p.id} key={p.id}>
                      <div className="w-full flex items-center gap-2">
                        <div>
                          <ProjectIcon project={p} className="size-5" />
                        </div>
                        <p className="text-sm font-medium">{p.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tagsOptions}
                  values={field.value}
                  onChangeValues={values => form.setValue("taskTags", values)}
                  allowCreate={true}
                  onCreate={onCreateNewTag}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-1" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="w-full flex">
          <LoaderButton
            className="w-full"
            isLoading={loading}
            disabled={loading}
            type="submit"
          >
            Update Task
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
