"use client";

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
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
import { Project } from "@/db/schema";
import ProjectIcon from "@/components/project/project-icon";
import { GetTaskUseCaseReturn } from "@/use-cases/types";

type Props = {
  onClose?: () => void;
  workspaceMembers: MemberWithUserEmailAndProfileType[];
  projects: Project[];
  task: GetTaskUseCaseReturn;
  taskId: string;
};

export default function UpdateTaskForm({
  onClose,
  projects,
  taskId,
  workspaceMembers,
  task,
}: Props) {
  const { form, onSubmit, error, loading } = useUpdateTask({
    onCallback: () => {
      onClose?.();
    },
    taskId,
    task,
  });

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
                  {TASK_STATUS.map((m, i) => (
                    <SelectItem
                      value={m}
                      key={`${m}-${i}`}
                      className="capitalize"
                    >
                      {m.replaceAll("_", " ").toLowerCase()}
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
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize w-full h-11 dark:!bg-shark-900/60 bg-shark-50 rounded-sm">
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
