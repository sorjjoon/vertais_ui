import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import React from "react";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, Provider } from "urql";
import {
  LoginMutation,
  CurrentUserQuery,
  CurrentUserDocument,
  UpdateUserMutation,
  GetCourseDocument,
  Comment,
  MyCoursesQuery,
  MyCoursesDocument,
  SignUpCourseMutation,
  GradeFragmentDoc,
  GradeFragment,
  CourseFragmentDoc,
  CommentFragment,
  FeedbackFragment,
  SubmitFragmentDoc,
  SubmitFragment,
  PeerAssesmentPairFragment,
  PeerAssesmentPairFragmentDoc,
} from "../../generated/graphql";
import { parseDate } from "../../utils/utils";
import { DocumentNode } from "graphql";
import { DeepPartial } from "../../utils/types";

function typedUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  console.log("updating cache");
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

function updateFragment<T extends { id: number | string; __typename?: string }>(
  cache: Cache,
  fragmentDoc: DocumentNode,
  newData: DeepPartial<T>,
  id: number | string,
  updater = (providedNewData: DeepPartial<T>, oldData: T | null) => Object.assign(oldData ?? {}, providedNewData)
) {
  var keyArg = id != undefined ? { id } : newData;
  console.log("Frag updater");
  const oldFrag = cache.readFragment(fragmentDoc, keyArg) as any;
  const dataToWrite = updater(newData, oldFrag);
  if (!dataToWrite.id) {
    dataToWrite.id = id;
  }

  console.log("old", oldFrag);
  console.log("write", dataToWrite);
  cache.writeFragment(fragmentDoc, dataToWrite);
  return dataToWrite;
}
const transformToDate = (parent: any, _args: any, _cache: any, info: any) =>
  parent[info.fieldName] ? parseDate(parent[info.fieldName]) : null;

function transformAllDateFields() {
  return {
    createdAt: transformToDate,
    updatedAt: transformToDate,
    deadline: transformToDate,
    reveal: transformToDate,
  };
}

const makeClient = () => {
  return createClient({
    url: process.env.NEXT_PUBLIC_API_URL!,
    fetchOptions: { credentials: "include" },
    exchanges: [
      cacheExchange({
        keys: {
          Answer: (a: any) => a.task?.id,
          AssignmentOptions: () => null,
          PeerAssesmentOptions: () => null,
        },

        resolvers: {
          Account: transformAllDateFields(),
          Answer: transformAllDateFields(),
          Assignment: transformAllDateFields(),
          AssignmentOptions: transformAllDateFields(),
          Comment: transformAllDateFields(),
          Course: transformAllDateFields(),
          Feedback: transformAllDateFields(),
          FileDetails: transformAllDateFields(),
          Grade: transformAllDateFields(),
          PeerAssesmentAssignment: transformAllDateFields(),
          PeerAssesmentOptions: transformAllDateFields(),
          PeerAssesmentPair: transformAllDateFields(),
          Submit: transformAllDateFields(),
          Task: transformAllDateFields(),
        },

        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              try {
                console.log("Cache update");
                return typedUpdateQuery<LoginMutation, CurrentUserQuery>(
                  cache,
                  { query: CurrentUserDocument },
                  _result,
                  () => {
                    return { currentUser: null };
                  }
                );
              } catch (err) {
                console.log("Error in logout cache", err);
                throw err;
              }
            },
            login: (_result, args, cache, info) => {
              try {
                console.log("Cache update");
                return typedUpdateQuery<LoginMutation, CurrentUserQuery>(
                  cache,
                  { query: CurrentUserDocument },
                  _result,
                  (result, query) => {
                    if (result?.login?.errors) {
                      return query;
                    } else {
                      return { currentUser: result.login?.user };
                    }
                  }
                );
              } catch (err) {
                console.log("Error in login cache", err);
                throw err;
              }
            },
            signUpCourse: (_result, args, cache, info) => {
              if (!_result.signUpCourse) {
                return;
              }
              try {
                console.log("Cache update");
                return typedUpdateQuery<SignUpCourseMutation, MyCoursesQuery>(
                  cache,
                  { query: MyCoursesDocument },
                  _result,
                  (res, q) => {
                    return { getMyCourses: res.signUpCourse };
                  }
                );
              } catch (err) {
                console.log("Error in signUpCourse cache", err);
                throw err;
              }
            },

            updateUser: (_result, args, cache, info) => {
              try {
                console.log("Cache update");
                return typedUpdateQuery<UpdateUserMutation, CurrentUserQuery>(
                  cache,
                  { query: CurrentUserDocument },
                  _result,
                  (result, query) => {
                    if (result?.updateUser?.errors) {
                      return query;
                    } else {
                      return { currentUser: result.updateUser?.user };
                    }
                  }
                );
              } catch (err) {
                console.log("Error in updateUser cache", err);
                throw err;
              }
            },
            insertComment: (_result, args, cache, info) => {
              try {
                const comment = _result.insertComment as Comment;
                console.log("insertComment cache update");
                console.log(comment);
                console.log(cache.inspectFields("Query"));
                if (comment.course) {
                  cache.updateQuery(
                    {
                      query: GetCourseDocument,
                      variables: { id: comment.course.id },
                    },
                    (data: any) => {
                      if (data) {
                        data.getCourse.comments.unshift(comment);
                      }
                      return data;
                    }
                  );
                }
              } catch (err) {
                console.log("Error in insertComment cache", err);
                throw err;
              }
            },
            deleteComment: (_result, args, cache, info) => {
              try {
                console.log("Cache update");
                const comment = _result.deleteComment as Comment;
                console.log("delete comment cache", comment);
                console.log("Cache update");
                let frag: DocumentNode;
                var id: number;
                if (comment.course) {
                  frag = CourseFragmentDoc;
                  id = comment.course.id;
                } else if (comment.grade) {
                  frag = GradeFragmentDoc;
                  id = comment.grade.id;
                } else {
                  console.error("deleteComment cache error No forgeign key on comment");
                  return;
                }

                const oldData = cache.readFragment(frag, { id }) as any;
                oldData.comments = oldData.comments.filter((c: CommentFragment) => c.id != comment.id);
                cache.writeFragment(frag, oldData);
              } catch (err) {
                console.log("Error in deleteAssignment cache", err);
                throw err;
              }
            },

            deleteAssignment: (_result, args, cache, info) => {
              try {
                console.log("Cache update");
                const a = _result.deleteAssignment as {
                  id: number;
                  course: { id: number };
                };
                cache.invalidate({ __typename: "Assignment", id: a.id });
              } catch (err) {
                console.log("Error in deleteAssignment cache", err);
                throw err;
              }
            },
            deleteFeedback: (_result, args, cache, info) => {
              try {
                console.log("delete cache");
                const f = _result.deleteFeedback as DeepPartial<FeedbackFragment>;
                if (!f) {
                  return;
                }
                if (f.grade?.id) {
                  updateFragment<GradeFragment>(cache, GradeFragmentDoc, f.grade, f.grade.id, (data, oldData) => {
                    return {
                      __typename: "Grade",
                      ...oldData,
                      feedbacks: (oldData?.feedbacks ?? []).filter((x) => x.id != f.id),
                    };
                  });
                }
                if (f.peerAssesment?.id) {
                  updateFragment<PeerAssesmentPairFragment>(
                    cache,
                    PeerAssesmentPairFragmentDoc,
                    f.peerAssesment,
                    f.peerAssesment.id,
                    (data, oldData) => {
                      return { ...oldData, feedbacks: (oldData?.feedbacks ?? []).filter((x) => x.id != f.id) };
                    }
                  );
                }
              } catch (err) {
                console.log("Error in deleteFeedback cache", err);
                throw err;
              }
            },

            updateFeedback: (_result, args, cache, info) => {
              try {
                console.log("update cache");
                const f = _result.updateFeedback as FeedbackFragment;
                if (!f) {
                  return;
                }
                if (f.grade && f.grade.id) {
                  const newGrade = updateFragment<GradeFragment>(
                    cache,
                    GradeFragmentDoc,
                    f.grade,
                    f.grade.id,
                    (data, oldData) => {
                      return {
                        ...oldData,
                        __typename: "Grade",
                        feedbacks: (oldData?.feedbacks ?? []).filter((x) => x.id != f.id).concat([f]),
                      };
                    }
                  );

                  updateFragment<SubmitFragment>(cache, SubmitFragmentDoc, { grade: newGrade }, f.grade.submitId);
                }
                if (f.peerAssesment?.id) {
                  updateFragment<PeerAssesmentPairFragment>(
                    cache,
                    PeerAssesmentPairFragmentDoc,
                    f.peerAssesment,
                    f.peerAssesment?.id,
                    (data, oldData) => {
                      return {
                        ...oldData,
                        __typename: "PeerAssesmentPair",
                        feedbacks: (oldData?.feedbacks ?? []).filter((x) => x.id != f.id).concat([f]),
                      };
                    }
                  );
                }
              } catch (err) {
                console.log("Error in updateFeedback cache", err);
                throw err;
              }
            },
          },
        },
      }),
      dedupExchange,
      multipartFetchExchange,
    ],
  });
};

export const UrqlClientProvider: React.FC = ({ children }) => {
  const [client, setClient] = React.useState(makeClient());

  return (
    <ClientContext.Provider
      value={{
        resetClient: () => {
          console.log("reseting client");
          setClient(makeClient());
        },
      }}
    >
      <Provider value={client}>{children}</Provider>
    </ClientContext.Provider>
  );
};
const ClientContext = React.createContext<{ resetClient: () => void }>({
  resetClient: () => undefined,
});
export const useClient = () => React.useContext(ClientContext);
