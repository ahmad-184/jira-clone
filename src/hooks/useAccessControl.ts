// import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query"; // Assuming you have a user hook
// import { accessControl } from "@/lib/access-control";
// import type { Resource } from "@/lib/access-control";

// export function useAccessControl() {
//   const { data } = useCurrentUserQuery();

//   if (!data?.user) return;

//   return {
//     canCreate: () => accessControl.canCreate(data.user),
//     canRead: (resource?: Resource) =>
//       accessControl.canRead(data.user, resource),
//     canUpdate: (resource?: Resource) =>
//       accessControl.canUpdate(data.user, resource),
//     canDelete: (resource?: Resource) =>
//       accessControl.canDelete(data.user, resource),
//   };
// }
