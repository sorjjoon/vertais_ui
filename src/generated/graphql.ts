import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Account = {
  __typename?: "Account";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Username used for logging in */
  username: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  /** User role, teacher or student for normal users */
  role: UserRole;
  email?: Maybe<Scalars["String"]>;
  /** Courses taught by the user */
  teachedCourses: Array<Course>;
  /** Courses user has signed up as a student */
  signedUpCourses: Array<CourseSignUp>;
  submits: Array<Submit>;
};

export type AccountResponse = {
  __typename?: "AccountResponse";
  /** What errors the user input contained (such as username taken, or password too short) and which field was invalid */
  errors?: Maybe<Array<FieldError>>;
  /** If given input was valid, and saving the user was successfull. Otherwise null */
  user?: Maybe<Account>;
};

export type Answer = {
  __typename?: "Answer";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Sanitized html */
  description?: Maybe<Scalars["String"]>;
  task: Task;
  files: Array<FileDetails>;
};

export type Assignment = {
  __typename?: "Assignment";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** Sanitized html content */
  description?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  course: Course;
  tasks: Array<Task>;
  options: AssignmentOptions;
  files: Array<FileDetails>;
  /** @deprecated Use options object instead */
  reveal: Scalars["DateTime"];
  /** @deprecated Use options object instead */
  deadline?: Maybe<Scalars["DateTime"]>;
  peerAssesment?: Maybe<PeerAssesmentAssignment>;
};

export type AssignmentOptions = {
  __typename?: "AssignmentOptions";
  /** If this assignment should have peer assesment after the deadline */
  hasPeerAssesment: Scalars["Boolean"];
  reveal: Scalars["DateTime"];
  deadline?: Maybe<Scalars["DateTime"]>;
};

/** Assignment options */
export type AssignmentOptionsInput = {
  /** If this assignment should have peer assesment after the deadline */
  hasPeerAssesment: Scalars["Boolean"];
  reveal: Scalars["DateTime"];
  deadline?: Maybe<Scalars["DateTime"]>;
};

export type Base = {
  __typename?: "Base";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
};

export type BaseWithOwner = {
  __typename?: "BaseWithOwner";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
};

export type BaseWithOwnerNoPrimary = {
  __typename?: "BaseWithOwnerNoPrimary";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Entity owner (entity creator) */
  owner: Account;
};

export type BaseWithPrimary = {
  __typename?: "BaseWithPrimary";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
};

export type BlogPost = {
  __typename?: "BlogPost";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** markdown content */
  content: Scalars["String"];
  /** The sub category, this post belongs to */
  category: Scalars["String"];
};

export type Comment = {
  __typename?: "Comment";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** Sanitized html content */
  content: Scalars["String"];
  course?: Maybe<Course>;
  grade?: Maybe<Grade>;
  peerAssesmentPair?: Maybe<PeerAssesmentPair>;
  reveal: Scalars["DateTime"];
  files: Array<FileDetails>;
};

export type CommentTarget = {
  course?: Maybe<Scalars["Int"]>;
  grade?: Maybe<Scalars["Int"]>;
  peerAssesmentPair?: Maybe<Scalars["Int"]>;
};

export type Course = {
  __typename?: "Course";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** Plain text content */
  description?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  icon: Scalars["String"];
  code: Scalars["String"];
  abbreviation?: Maybe<Scalars["String"]>;
  studentSignups: Array<CourseSignUp>;
  assignments: Array<Assignment>;
  comments: Array<Comment>;
};

export type CourseSignUp = {
  __typename?: "CourseSignUp";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  course: Course;
  student: Account;
};

export type EntityId = {
  id: Scalars["Float"];
};

export type Feedback = {
  __typename?: "Feedback";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** plain text content */
  description: Scalars["String"];
  grade?: Maybe<Grade>;
  peerAssesment?: Maybe<PeerAssesmentPair>;
  /** Which child index of the submit description this feedback is for */
  childIndex: Scalars["Int"];
};

export type FieldError = {
  __typename?: "FieldError";
  message: Scalars["String"];
  fieldName: Scalars["String"];
};

export type FileDetails = {
  __typename?: "FileDetails";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  description?: Maybe<Scalars["String"]>;
  filename: Scalars["String"];
  mimetype: Scalars["String"];
};

export type FileTarget = {
  course?: Maybe<EntityId>;
  comment?: Maybe<EntityId>;
  assignment?: Maybe<EntityId>;
  task?: Maybe<EntityId>;
  answer?: Maybe<EntityId>;
  submit?: Maybe<EntityId>;
};

export type Grade = {
  __typename?: "Grade";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Entity owner (entity creator) */
  owner: Account;
  id: Scalars["Float"];
  points?: Maybe<Scalars["Float"]>;
  submit: Submit;
  submitId: Scalars["Float"];
  isRevealed: Scalars["Boolean"];
  comments: Array<Comment>;
  feedbacks: Array<Feedback>;
};

export type GradeInfo = {
  points?: Maybe<Scalars["Float"]>;
  isRevealed?: Maybe<Scalars["Boolean"]>;
};

/** Common info describing a resource. Id field must omitted, if intending to create a new resource */
export type Info = {
  /** Id of the resource you are attempting to update. Must be omitted to create a new resource */
  id?: Maybe<Scalars["Int"]>;
  /** (unsanitzed) html description of this resource */
  description: Scalars["String"];
  /** files to be linked to this resource. Files must first have been uploaded. Can not be omitted, use an empty list, if there are no files to be linked */
  filesToLink: Array<Scalars["Int"]>;
  /** files that used to be linked to this resouce, that must be deleted. Can be omitted */
  filesToDelete?: Maybe<Array<Scalars["Int"]>>;
};

export type Mutation = {
  __typename?: "Mutation";
  register?: Maybe<AccountResponse>;
  resetPassword: Scalars["Boolean"];
  logout: Scalars["Boolean"];
  login?: Maybe<AccountResponse>;
  updateUser?: Maybe<AccountResponse>;
  updateAssignment?: Maybe<Course>;
  deleteAssignment: Assignment;
  insertAssignment: Course;
  insertBlogPost: BlogPost;
  updateBlogPost: BlogPost;
  deleteBlogPost: Scalars["Int"];
  insertComment: Comment;
  deleteComment: Comment;
  updateComment: Comment;
  generateDummyCourse?: Maybe<Course>;
  insertCourse?: Maybe<Course>;
  signUpCourse?: Maybe<Array<Course>>;
  updateCourse?: Maybe<Course>;
  /** Adds a new feedback to the specfic grade. If the grade does not exsists, inserts a new grade first. If an empty string is used as the descpription, will instead delete any exsisting feedback */
  updateFeedback: Feedback;
  deleteFeedback?: Maybe<Feedback>;
  uploadFiles: Array<FileDetails>;
  deleteFiles: Array<FileDetails>;
  updatePeerAssesment: PeerAssesmentPair;
  updateSubmit: Task;
  deleteSubmit: Task;
  updateGrade: Submit;
};

export type MutationRegisterArgs = {
  is_teacher: Scalars["Boolean"];
  lastName: Scalars["String"];
  firstName: Scalars["String"];
  credentials: UsernamePasswordInput;
};

export type MutationResetPasswordArgs = {
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  credentials: UsernamePasswordInput;
};

export type MutationUpdateUserArgs = {
  resetToken?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  credentials?: Maybe<UsernamePasswordInput>;
};

export type MutationUpdateAssignmentArgs = {
  tasks: Array<TaskInfo>;
  peerAssesmentOptions: PeerAssesmentOptionsInput;
  options: AssignmentOptionsInput;
  id?: Maybe<Scalars["Int"]>;
  description: Scalars["String"];
  filesToLink: Array<Scalars["Int"]>;
  filesToDelete?: Maybe<Array<Scalars["Int"]>>;
  name: Scalars["String"];
};

export type MutationDeleteAssignmentArgs = {
  id: Scalars["Int"];
};

export type MutationInsertAssignmentArgs = {
  tasks: Array<TaskInfo>;
  courseId: Scalars["Int"];
  peerAssesmentOptions: PeerAssesmentOptionsInput;
  options: AssignmentOptionsInput;
  id?: Maybe<Scalars["Int"]>;
  description: Scalars["String"];
  filesToLink: Array<Scalars["Int"]>;
  filesToDelete?: Maybe<Array<Scalars["Int"]>>;
  name: Scalars["String"];
};

export type MutationInsertBlogPostArgs = {
  isPublic?: Maybe<Scalars["Boolean"]>;
  content: Scalars["String"];
};

export type MutationUpdateBlogPostArgs = {
  isPublic?: Maybe<Scalars["Boolean"]>;
  id: Scalars["Int"];
  content: Scalars["String"];
};

export type MutationDeleteBlogPostArgs = {
  id: Scalars["Int"];
};

export type MutationInsertCommentArgs = {
  filesToLink?: Maybe<Array<Scalars["Int"]>>;
  files?: Maybe<Array<Scalars["Upload"]>>;
  reveal?: Maybe<Scalars["DateTime"]>;
  content: Scalars["String"];
  target: CommentTarget;
};

export type MutationDeleteCommentArgs = {
  id: Scalars["Int"];
};

export type MutationUpdateCommentArgs = {
  filesToDelete?: Maybe<Array<Scalars["Int"]>>;
  newFiles?: Maybe<Array<Scalars["Upload"]>>;
  reveal?: Maybe<Scalars["DateTime"]>;
  content?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
};

export type MutationInsertCourseArgs = {
  description?: Maybe<Scalars["String"]>;
  abbreviation?: Maybe<Scalars["String"]>;
  icon: Scalars["String"];
  name: Scalars["String"];
};

export type MutationSignUpCourseArgs = {
  code: Scalars["String"];
};

export type MutationUpdateCourseArgs = {
  icon?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  abbreviation?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
};

export type MutationUpdateFeedbackArgs = {
  description: Scalars["String"];
  targetId: Scalars["Int"];
  childIndex: Scalars["Int"];
};

export type MutationDeleteFeedbackArgs = {
  id: Scalars["Int"];
};

export type MutationUploadFilesArgs = {
  target?: Maybe<FileTarget>;
  files: Array<Scalars["Upload"]>;
};

export type MutationDeleteFilesArgs = {
  files: Array<Scalars["Int"]>;
};

export type MutationUpdatePeerAssesmentArgs = {
  description?: Maybe<Scalars["String"]>;
  points?: Maybe<Scalars["Int"]>;
  pairId: Scalars["Int"];
};

export type MutationUpdateSubmitArgs = {
  data: Info;
};

export type MutationDeleteSubmitArgs = {
  id: Scalars["Int"];
};

export type MutationUpdateGradeArgs = {
  submitId: Scalars["Int"];
  data: GradeInfo;
};

export type PeerAssesmentAssignment = {
  __typename?: "PeerAssesmentAssignment";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  assignment: Assignment;
  options: PeerAssesmentOptions;
  pairs?: Maybe<Array<PeerAssesmentPair>>;
};

export type PeerAssesmentOptions = {
  __typename?: "PeerAssesmentOptions";
  /** How many peer assesments each participant should do (if possible) */
  peerAssesmentCount: Scalars["Int"];
  deadline: Scalars["DateTime"];
  /** If assessor / asessed pairs have been generated for this peer assesment */
  pairsHaveBeenGenerated?: Maybe<Scalars["Boolean"]>;
  revealAutomatically: Scalars["Boolean"];
};

/** PeerAssesment options */
export type PeerAssesmentOptionsInput = {
  /** How many peer assesments each participant should do (if possible) */
  peerAssesmentCount: Scalars["Int"];
  deadline: Scalars["DateTime"];
  /** If assessor / asessed pairs have been generated for this peer assesment */
  pairsHaveBeenGenerated?: Maybe<Scalars["Boolean"]>;
  revealAutomatically: Scalars["Boolean"];
};

export type PeerAssesmentPair = {
  __typename?: "PeerAssesmentPair";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** The student assessing another student's work */
  assessor: Account;
  peerAssesmentAssignment: PeerAssesmentAssignment;
  points?: Maybe<Scalars["Float"]>;
  comments: Array<Comment>;
  feedbacks: Array<Feedback>;
  /** All the submits this student is supposed to give feedback for */
  assessedSubmits: Array<Submit>;
  /** Sanitized html */
  description?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  currentUser?: Maybe<Account>;
  getUpcomingAssignments: UpcomingAssignmentsReturnType;
  getAssignments?: Maybe<Course>;
  getAllBlogPosts: Array<BlogPost>;
  getComments: Array<Comment>;
  getCourse?: Maybe<Course>;
  getStudents: Array<Account>;
  getMyCourses?: Maybe<Array<Course>>;
  getMyPeerAssesment?: Maybe<PeerAssesmentAssignment>;
  /** Provide either the submit id, or the owner of the submit and the task submit is targeting */
  getSubmit?: Maybe<Task>;
  /** Provide either the submit id, or the owner of the submit and the task submit is targeting */
  getSubmits: Array<Submit>;
};

export type QueryGetAssignmentsArgs = {
  courseId: Scalars["Int"];
};

export type QueryGetCommentsArgs = {
  target: CommentTarget;
};

export type QueryGetCourseArgs = {
  id: Scalars["Int"];
};

export type QueryGetStudentsArgs = {
  courseId: Scalars["Int"];
};

export type QueryGetMyCoursesArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryGetMyPeerAssesmentArgs = {
  id: Scalars["Int"];
};

export type QueryGetSubmitArgs = {
  taskId?: Maybe<Scalars["Int"]>;
  ownerId?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
};

export type QueryGetSubmitsArgs = {
  taskId?: Maybe<Scalars["Int"]>;
};

export type Submit = {
  __typename?: "Submit";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** Sanitized html content */
  description?: Maybe<Scalars["String"]>;
  task: Task;
  files: Array<FileDetails>;
  grade?: Maybe<Grade>;
};

export type Task = {
  __typename?: "Task";
  /** Entity creation date */
  createdAt: Scalars["DateTime"];
  /** Entity update date */
  updatedAt: Scalars["DateTime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Entity owner (entity creator) */
  owner: Account;
  /** Sanitized html content */
  description?: Maybe<Scalars["String"]>;
  number: Scalars["Int"];
  assignment: Assignment;
  files: Array<FileDetails>;
  answer?: Maybe<Answer>;
  /** Contains submits the user has access to. For any user with the role student, this will be either an empty list, or a list with 1 item (containing the users own submit). For students, use the 'mySubmit' field instead */
  submits: Array<Submit>;
  points: Scalars["Float"];
  /** Value of the current submit value for this user. Will always be null, if the user is a teacher */
  mySubmit?: Maybe<Submit>;
};

export type TaskInfo = {
  /** Id of the resource you are attempting to update. Must be omitted to create a new resource */
  id?: Maybe<Scalars["Int"]>;
  /** (unsanitzed) html description of this resource */
  description: Scalars["String"];
  /** files to be linked to this resource. Files must first have been uploaded. Can not be omitted, use an empty list, if there are no files to be linked */
  filesToLink: Array<Scalars["Int"]>;
  /** files that used to be linked to this resouce, that must be deleted. Can be omitted */
  filesToDelete?: Maybe<Array<Scalars["Int"]>>;
  answer?: Maybe<Info>;
  points?: Maybe<Scalars["Int"]>;
};

export type UpcomingAssignmentsReturnType = {
  __typename?: "UpcomingAssignmentsReturnType";
  assignments: Array<Assignment>;
  peerAssesments: Array<PeerAssesmentAssignment>;
};

/** user roles */
export enum UserRole {
  Admin = "ADMIN",
  Teacher = "TEACHER",
  Student = "STUDENT",
  Dummy = "DUMMY",
}

export type UsernamePasswordInput = {
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type AnswerFragment = { __typename?: "Answer" } & Pick<Answer, "description" | "createdAt" | "updatedAt"> & {
    files: Array<{ __typename?: "FileDetails" } & FileFragment>;
    task: { __typename?: "Task" } & Pick<Task, "id">;
  };

export type AssignmentFragment = { __typename?: "Assignment" } & Pick<
  Assignment,
  "id" | "name" | "description" | "createdAt" | "updatedAt" | "deadline" | "reveal"
> & {
    files: Array<{ __typename?: "FileDetails" } & FileFragment>;
    tasks: Array<{ __typename?: "Task" } & TaskFragment>;
    course: { __typename?: "Course" } & Pick<Course, "id">;
    options: { __typename?: "AssignmentOptions" } & AssignmentOptionsFragment;
    peerAssesment?: Maybe<
      { __typename?: "PeerAssesmentAssignment" } & Pick<PeerAssesmentAssignment, "id"> & {
          pairs?: Maybe<
            Array<
              { __typename?: "PeerAssesmentPair" } & Pick<PeerAssesmentPair, "id" | "points"> & {
                  assessor: { __typename?: "Account" } & Pick<Account, "id">;
                }
            >
          >;
          options: { __typename?: "PeerAssesmentOptions" } & PeerAssesmentOptionsFragment;
        }
    >;
  };

export type AssignmentOptionsFragment = { __typename?: "AssignmentOptions" } & Pick<
  AssignmentOptions,
  "deadline" | "reveal" | "hasPeerAssesment"
>;

export type CommentFragment = { __typename?: "Comment" } & Pick<
  Comment,
  "id" | "content" | "reveal" | "createdAt" | "updatedAt"
> & {
    course?: Maybe<{ __typename?: "Course" } & Pick<Course, "id">>;
    owner: { __typename?: "Account" } & AccountDetailsFragment;
    files: Array<{ __typename?: "FileDetails" } & Pick<FileDetails, "id" | "filename">>;
    grade?: Maybe<
      { __typename?: "Grade" } & Pick<Grade, "id"> & {
          comments: Array<{ __typename?: "Comment" } & Pick<Comment, "id">>;
        }
    >;
  };

export type CourseFragment = { __typename?: "Course" } & Pick<
  Course,
  "id" | "name" | "description" | "abbreviation" | "code" | "createdAt" | "updatedAt" | "icon"
> & {
    owner: { __typename?: "Account" } & AccountDetailsFragment;
    comments: Array<{ __typename?: "Comment" } & CommentFragment>;
  };

export type FeedbackFragment = { __typename?: "Feedback" } & Pick<
  Feedback,
  "id" | "description" | "createdAt" | "updatedAt" | "childIndex"
> & {
    grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id" | "submitId">>;
    peerAssesment?: Maybe<{ __typename?: "PeerAssesmentPair" } & Pick<PeerAssesmentPair, "id">>;
  };

export type FileFragment = { __typename?: "FileDetails" } & Pick<
  FileDetails,
  "id" | "filename" | "createdAt" | "updatedAt" | "mimetype"
>;

export type GradeFragment = { __typename?: "Grade" } & Pick<
  Grade,
  "id" | "createdAt" | "updatedAt" | "points" | "isRevealed" | "submitId"
> & {
    owner: { __typename?: "Account" } & AccountDetailsFragment;
    comments: Array<{ __typename?: "Comment" } & CommentFragment>;
    feedbacks: Array<{ __typename?: "Feedback" } & FeedbackFragment>;
  };

export type PeerAssesmentAssignmentFragment = { __typename?: "PeerAssesmentAssignment" } & Pick<
  PeerAssesmentAssignment,
  "id" | "createdAt" | "updatedAt"
> & {
    pairs?: Maybe<Array<{ __typename?: "PeerAssesmentPair" } & PeerAssesmentPairFragment>>;
    options: { __typename?: "PeerAssesmentOptions" } & PeerAssesmentOptionsFragment;
    assignment: { __typename?: "Assignment" } & Pick<Assignment, "id" | "createdAt" | "updatedAt" | "name"> & {
        options: { __typename?: "AssignmentOptions" } & Pick<AssignmentOptions, "deadline" | "hasPeerAssesment">;
        tasks: Array<{ __typename?: "Task" } & Pick<Task, "id" | "number" | "points">>;
      };
  };

export type PeerAssesmentOptionsFragment = { __typename?: "PeerAssesmentOptions" } & Pick<
  PeerAssesmentOptions,
  "peerAssesmentCount" | "revealAutomatically" | "deadline"
>;

export type PeerAssesmentPairFragment = { __typename?: "PeerAssesmentPair" } & Pick<
  PeerAssesmentPair,
  "id" | "createdAt" | "updatedAt" | "points" | "description"
> & {
    assessor: { __typename?: "Account" } & AccountDetailsFragment;
    assessedSubmits: Array<
      { __typename?: "Submit" } & Pick<Submit, "id" | "createdAt" | "updatedAt" | "description"> & {
          owner: { __typename?: "Account" } & Pick<Account, "id">;
          task: { __typename?: "Task" } & Pick<Task, "id" | "number">;
          files: Array<{ __typename?: "FileDetails" } & FileFragment>;
        }
    >;
    feedbacks: Array<{ __typename?: "Feedback" } & FeedbackFragment>;
    comments: Array<{ __typename?: "Comment" } & CommentFragment>;
  };

export type SubmitFragment = { __typename?: "Submit" } & Pick<
  Submit,
  "id" | "createdAt" | "updatedAt" | "description"
> & {
    owner: { __typename?: "Account" } & AccountDetailsFragment;
    task: { __typename?: "Task" } & Pick<Task, "id">;
    files: Array<{ __typename?: "FileDetails" } & FileFragment>;
    grade?: Maybe<{ __typename?: "Grade" } & GradeFragment>;
  };

export type TaskFragment = { __typename?: "Task" } & Pick<
  Task,
  "id" | "number" | "createdAt" | "updatedAt" | "description" | "points"
> & {
    files: Array<{ __typename?: "FileDetails" } & FileFragment>;
    submits: Array<
      { __typename?: "Submit" } & Pick<Submit, "id" | "updatedAt"> & {
          grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id" | "updatedAt" | "points">>;
          owner: { __typename?: "Account" } & Pick<Account, "id">;
        }
    >;
    mySubmit?: Maybe<
      { __typename?: "Submit" } & Pick<Submit, "id" | "updatedAt"> & {
          grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id" | "updatedAt">>;
        }
    >;
    answer?: Maybe<{ __typename?: "Answer" } & AnswerFragment>;
  };

export type UserFragment = { __typename?: "Account" } & Pick<
  Account,
  "username" | "createdAt" | "updatedAt" | "email"
> &
  AccountDetailsFragment;

export type AccountDetailsFragment = { __typename?: "Account" } & Pick<
  Account,
  "id" | "role" | "firstName" | "lastName"
>;

export type AccountResponseFragment = { __typename?: "AccountResponse" } & {
  errors?: Maybe<Array<{ __typename?: "FieldError" } & FieldErrorFragment>>;
  user?: Maybe<{ __typename?: "Account" } & UserFragment>;
};

export type FieldErrorFragment = { __typename?: "FieldError" } & Pick<FieldError, "message" | "fieldName">;

export type DeleteAssignmentMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeleteAssignmentMutation = { __typename?: "Mutation" } & {
  deleteAssignment: { __typename?: "Assignment" } & Pick<Assignment, "id"> & {
      course: { __typename?: "Course" } & Pick<Course, "id">;
    };
};

export type InsertAssignmentMutationVariables = Exact<{
  name: Scalars["String"];
  options: AssignmentOptionsInput;
  peerAssesmentOptions: PeerAssesmentOptionsInput;
  description: Scalars["String"];
  filesToLink: Array<Scalars["Int"]> | Scalars["Int"];
  filesToDelete: Array<Scalars["Int"]> | Scalars["Int"];
  tasks: Array<TaskInfo> | TaskInfo;
  courseId: Scalars["Int"];
}>;

export type InsertAssignmentMutation = { __typename?: "Mutation" } & {
  insertAssignment: { __typename?: "Course" } & Pick<Course, "id"> & {
      assignments: Array<{ __typename?: "Assignment" } & AssignmentFragment>;
    };
};

export type UpdateAssignmentMutationVariables = Exact<{
  name: Scalars["String"];
  options: AssignmentOptionsInput;
  description: Scalars["String"];
  peerAssesmentOptions: PeerAssesmentOptionsInput;
  filesToLink: Array<Scalars["Int"]> | Scalars["Int"];
  filesToDelete: Array<Scalars["Int"]> | Scalars["Int"];
  tasks: Array<TaskInfo> | TaskInfo;
  id: Scalars["Int"];
}>;

export type UpdateAssignmentMutation = { __typename?: "Mutation" } & {
  updateAssignment?: Maybe<
    { __typename?: "Course" } & Pick<Course, "id"> & {
        assignments: Array<{ __typename?: "Assignment" } & AssignmentFragment>;
      }
  >;
};

export type UpdatePeerAssesmentMutationVariables = Exact<{
  pairId: Scalars["Int"];
  points?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
}>;

export type UpdatePeerAssesmentMutation = { __typename?: "Mutation" } & {
  updatePeerAssesment: { __typename?: "PeerAssesmentPair" } & Pick<
    PeerAssesmentPair,
    "id" | "points" | "updatedAt" | "description"
  >;
};

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeleteCommentMutation = { __typename?: "Mutation" } & {
  deleteComment: { __typename?: "Comment" } & Pick<Comment, "id"> & {
      owner: { __typename?: "Account" } & Pick<Account, "id">;
      course?: Maybe<{ __typename?: "Course" } & Pick<Course, "id">>;
      grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id">>;
    };
};

export type InsertCommentMutationVariables = Exact<{
  content: Scalars["String"];
  course?: Maybe<Scalars["Int"]>;
  grade?: Maybe<Scalars["Int"]>;
  reveal?: Maybe<Scalars["DateTime"]>;
  filesToLink?: Maybe<Array<Scalars["Int"]> | Scalars["Int"]>;
}>;

export type InsertCommentMutation = { __typename?: "Mutation" } & {
  insertComment: { __typename?: "Comment" } & CommentFragment;
};

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars["Int"];
  content?: Maybe<Scalars["String"]>;
  reveal?: Maybe<Scalars["DateTime"]>;
  filesToDelete?: Maybe<Array<Scalars["Int"]> | Scalars["Int"]>;
}>;

export type UpdateCommentMutation = { __typename?: "Mutation" } & {
  updateComment: { __typename?: "Comment" } & CommentFragment;
};

export type InsertCourseMutationVariables = Exact<{
  name: Scalars["String"];
  icon: Scalars["String"];
  abbreviation?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
}>;

export type InsertCourseMutation = { __typename?: "Mutation" } & {
  insertCourse?: Maybe<
    { __typename?: "Course" } & Pick<
      Course,
      "id" | "icon" | "createdAt" | "updatedAt" | "description" | "abbreviation" | "name"
    >
  >;
};

export type SignUpCourseMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type SignUpCourseMutation = { __typename?: "Mutation" } & {
  signUpCourse?: Maybe<Array<{ __typename?: "Course" } & CourseFragment>>;
};

export type UpdateCourseMutationVariables = Exact<{
  id: Scalars["Int"];
  description?: Maybe<Scalars["String"]>;
  abbreviation?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  icon?: Maybe<Scalars["String"]>;
}>;

export type UpdateCourseMutation = { __typename?: "Mutation" } & {
  updateCourse?: Maybe<
    { __typename?: "Course" } & Pick<
      Course,
      "id" | "icon" | "createdAt" | "updatedAt" | "description" | "abbreviation" | "name"
    >
  >;
};

export type UploadFilesMutationVariables = Exact<{
  files: Array<Scalars["Upload"]> | Scalars["Upload"];
  target?: Maybe<FileTarget>;
}>;

export type UploadFilesMutation = { __typename?: "Mutation" } & {
  uploadFiles: Array<{ __typename?: "FileDetails" } & Pick<FileDetails, "id" | "filename">>;
};

export type DeleteFeedbackMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeleteFeedbackMutation = { __typename?: "Mutation" } & {
  deleteFeedback?: Maybe<
    { __typename?: "Feedback" } & Pick<Feedback, "id"> & {
        grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id">>;
        peerAssesment?: Maybe<{ __typename?: "PeerAssesmentPair" } & Pick<PeerAssesmentPair, "id">>;
      }
  >;
};

export type DeleteSubmitMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeleteSubmitMutation = { __typename?: "Mutation" } & {
  deleteSubmit: { __typename?: "Task" } & Pick<Task, "id"> & {
      mySubmit?: Maybe<{ __typename?: "Submit" } & Pick<Submit, "id">>;
    };
};

export type UpdateFeedbackMutationVariables = Exact<{
  targetId: Scalars["Int"];
  childIndex: Scalars["Int"];
  description: Scalars["String"];
}>;

export type UpdateFeedbackMutation = { __typename?: "Mutation" } & {
  updateFeedback: { __typename?: "Feedback" } & FeedbackFragment;
};

export type UpdateGradeMutationVariables = Exact<{
  submitId: Scalars["Int"];
  points?: Maybe<Scalars["Float"]>;
  isRevealed?: Maybe<Scalars["Boolean"]>;
}>;

export type UpdateGradeMutation = { __typename?: "Mutation" } & {
  updateGrade: { __typename?: "Submit" } & Pick<Submit, "id"> & {
      grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id" | "points" | "isRevealed">>;
    };
};

export type UpdateSubmitMutationVariables = Exact<{
  data: Info;
}>;

export type UpdateSubmitMutation = { __typename?: "Mutation" } & {
  updateSubmit: { __typename?: "Task" } & Pick<Task, "id"> & {
      mySubmit?: Maybe<{ __typename?: "Submit" } & SubmitFragment>;
    };
};

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars["String"];
  resetToken?: Maybe<Scalars["String"]>;
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
  updateUser?: Maybe<{ __typename?: "AccountResponse" } & AccountResponseFragment>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login?: Maybe<{ __typename?: "AccountResponse" } & AccountResponseFragment>;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<Mutation, "logout">;

export type RegisterMutationVariables = Exact<{
  isTeacher: Scalars["Boolean"];
  username: Scalars["String"];
  password: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register?: Maybe<{ __typename?: "AccountResponse" } & AccountResponseFragment>;
  generateDummyCourse?: Maybe<{ __typename?: "Course" } & CourseFragment>;
};

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ResetPasswordMutation = { __typename?: "Mutation" } & Pick<Mutation, "resetPassword">;

export type UpdateUserMutationVariables = Exact<{
  password?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
}>;

export type UpdateUserMutation = { __typename?: "Mutation" } & {
  updateUser?: Maybe<{ __typename?: "AccountResponse" } & AccountResponseFragment>;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = { __typename?: "Query" } & {
  currentUser?: Maybe<{ __typename?: "Account" } & UserFragment>;
};

export type GetAssignmentsQueryVariables = Exact<{
  courseId: Scalars["Int"];
}>;

export type GetAssignmentsQuery = { __typename?: "Query" } & {
  getAssignments?: Maybe<
    { __typename?: "Course" } & Pick<Course, "id"> & {
        assignments: Array<{ __typename?: "Assignment" } & AssignmentFragment>;
      }
  >;
};

export type GetCommentsQueryVariables = Exact<{
  target: CommentTarget;
}>;

export type GetCommentsQuery = { __typename?: "Query" } & {
  getComments: Array<{ __typename?: "Comment" } & CommentFragment>;
};

export type GetCourseQueryVariables = Exact<{
  id: Scalars["Int"];
}>;

export type GetCourseQuery = { __typename?: "Query" } & {
  getCourse?: Maybe<{ __typename?: "Course" } & CourseFragment>;
};

export type GetCourseSubmitDetailsQueryVariables = Exact<{
  id: Scalars["Int"];
}>;

export type GetCourseSubmitDetailsQuery = { __typename?: "Query" } & {
  getCourse?: Maybe<
    { __typename?: "Course" } & Pick<Course, "id"> & {
        assignments: Array<
          { __typename?: "Assignment" } & Pick<Assignment, "id" | "name"> & {
              options: { __typename?: "AssignmentOptions" } & AssignmentOptionsFragment;
              tasks: Array<
                { __typename?: "Task" } & Pick<Task, "id" | "points" | "number"> & {
                    mySubmit?: Maybe<
                      { __typename?: "Submit" } & Pick<Submit, "id" | "updatedAt"> & {
                          grade?: Maybe<{ __typename?: "Grade" } & Pick<Grade, "id" | "points">>;
                        }
                    >;
                  }
              >;
              peerAssesment?: Maybe<
                { __typename?: "PeerAssesmentAssignment" } & Pick<PeerAssesmentAssignment, "id"> & {
                    pairs?: Maybe<
                      Array<{ __typename?: "PeerAssesmentPair" } & Pick<PeerAssesmentPair, "id" | "points">>
                    >;
                    options: { __typename?: "PeerAssesmentOptions" } & PeerAssesmentOptionsFragment;
                  }
              >;
            }
        >;
      }
  >;
};

export type GetMyPeerAssesmentQueryVariables = Exact<{
  assignmentId: Scalars["Int"];
}>;

export type GetMyPeerAssesmentQuery = { __typename?: "Query" } & {
  getMyPeerAssesment?: Maybe<{ __typename?: "PeerAssesmentAssignment" } & PeerAssesmentAssignmentFragment>;
};

export type GetStudentsQueryVariables = Exact<{
  courseId: Scalars["Int"];
}>;

export type GetStudentsQuery = { __typename?: "Query" } & {
  getStudents: Array<{ __typename?: "Account" } & AccountDetailsFragment>;
};

export type GetSubmitQueryVariables = Exact<{
  id?: Maybe<Scalars["Int"]>;
  taskId?: Maybe<Scalars["Int"]>;
  ownerId?: Maybe<Scalars["Int"]>;
}>;

export type GetSubmitQuery = { __typename?: "Query" } & {
  getSubmit?: Maybe<
    { __typename?: "Task" } & Pick<Task, "id"> & { mySubmit?: Maybe<{ __typename?: "Submit" } & SubmitFragment> }
  >;
};

export type GetSubmitsQueryVariables = Exact<{
  taskId: Scalars["Int"];
}>;

export type GetSubmitsQuery = { __typename?: "Query" } & {
  getSubmits: Array<
    { __typename?: "Submit" } & Pick<Submit, "id"> & {
        owner: { __typename?: "Account" } & AccountDetailsFragment;
        grade?: Maybe<
          { __typename?: "Grade" } & Pick<Grade, "id" | "createdAt" | "updatedAt" | "points" | "isRevealed"> & {
              owner: { __typename?: "Account" } & AccountDetailsFragment;
            }
        >;
        task: { __typename?: "Task" } & Pick<Task, "id">;
      }
  >;
};

export type GetUpcomingAssignmentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUpcomingAssignmentsQuery = { __typename?: "Query" } & {
  getUpcomingAssignments: { __typename?: "UpcomingAssignmentsReturnType" } & {
    peerAssesments: Array<
      { __typename: "PeerAssesmentAssignment" } & Pick<PeerAssesmentAssignment, "id"> & {
          assignment: { __typename?: "Assignment" } & Pick<Assignment, "id" | "name">;
          options: { __typename?: "PeerAssesmentOptions" } & Pick<PeerAssesmentOptions, "deadline">;
        }
    >;
    assignments: Array<
      { __typename: "Assignment" } & Pick<Assignment, "id" | "name"> & {
          options: { __typename?: "AssignmentOptions" } & Pick<AssignmentOptions, "deadline">;
        }
    >;
  };
};

export type MyCoursesQueryVariables = Exact<{
  offset?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
}>;

export type MyCoursesQuery = { __typename?: "Query" } & {
  getMyCourses?: Maybe<Array<{ __typename?: "Course" } & CourseFragment>>;
};

export const FileFragmentDoc = gql`
  fragment File on FileDetails {
    id
    filename
    createdAt
    updatedAt
    mimetype
  }
`;
export const AnswerFragmentDoc = gql`
  fragment Answer on Answer {
    description
    createdAt
    updatedAt
    files {
      ...File
    }
    task {
      id
    }
  }
  ${FileFragmentDoc}
`;
export const TaskFragmentDoc = gql`
  fragment Task on Task {
    id
    number
    createdAt
    updatedAt
    description
    points
    files {
      ...File
    }
    submits {
      id
      updatedAt
      grade {
        id
        updatedAt
        points
      }
      owner {
        id
      }
    }
    mySubmit {
      id
      updatedAt
      grade {
        id
        updatedAt
      }
    }
    answer {
      ...Answer
    }
  }
  ${FileFragmentDoc}
  ${AnswerFragmentDoc}
`;
export const AssignmentOptionsFragmentDoc = gql`
  fragment AssignmentOptions on AssignmentOptions {
    deadline
    reveal
    hasPeerAssesment
  }
`;
export const PeerAssesmentOptionsFragmentDoc = gql`
  fragment PeerAssesmentOptions on PeerAssesmentOptions {
    peerAssesmentCount
    revealAutomatically
    deadline
  }
`;
export const AssignmentFragmentDoc = gql`
  fragment Assignment on Assignment {
    id
    name
    description
    createdAt
    updatedAt
    files {
      ...File
    }
    tasks {
      ...Task
    }
    course {
      id
    }
    deadline
    reveal
    options {
      ...AssignmentOptions
    }
    peerAssesment {
      id
      pairs {
        id
        points
        assessor {
          id
        }
      }
      options {
        ...PeerAssesmentOptions
      }
    }
  }
  ${FileFragmentDoc}
  ${TaskFragmentDoc}
  ${AssignmentOptionsFragmentDoc}
  ${PeerAssesmentOptionsFragmentDoc}
`;
export const AccountDetailsFragmentDoc = gql`
  fragment AccountDetails on Account {
    id
    role
    firstName
    lastName
  }
`;
export const CommentFragmentDoc = gql`
  fragment Comment on Comment {
    id
    content
    course {
      id
    }
    reveal
    createdAt
    updatedAt
    owner {
      ...AccountDetails
    }
    files {
      id
      filename
    }
    grade {
      id
      comments {
        id
      }
    }
  }
  ${AccountDetailsFragmentDoc}
`;
export const CourseFragmentDoc = gql`
  fragment Course on Course {
    id
    name
    description
    abbreviation
    code
    createdAt
    updatedAt
    icon
    owner {
      ...AccountDetails
    }
    comments {
      ...Comment
    }
  }
  ${AccountDetailsFragmentDoc}
  ${CommentFragmentDoc}
`;
export const FeedbackFragmentDoc = gql`
  fragment Feedback on Feedback {
    id
    description
    createdAt
    updatedAt
    childIndex
    grade {
      id
      submitId
    }
    peerAssesment {
      id
    }
  }
`;
export const PeerAssesmentPairFragmentDoc = gql`
  fragment PeerAssesmentPair on PeerAssesmentPair {
    id
    createdAt
    updatedAt
    points
    description
    assessor {
      ...AccountDetails
    }
    assessedSubmits {
      id
      createdAt
      updatedAt
      description
      owner {
        id
      }
      task {
        id
        number
      }
      files {
        ...File
      }
    }
    feedbacks {
      ...Feedback
    }
    comments {
      ...Comment
    }
  }
  ${AccountDetailsFragmentDoc}
  ${FileFragmentDoc}
  ${FeedbackFragmentDoc}
  ${CommentFragmentDoc}
`;
export const PeerAssesmentAssignmentFragmentDoc = gql`
  fragment PeerAssesmentAssignment on PeerAssesmentAssignment {
    id
    createdAt
    updatedAt
    pairs {
      ...PeerAssesmentPair
    }
    options {
      ...PeerAssesmentOptions
    }
    assignment {
      id
      createdAt
      updatedAt
      name
      options {
        deadline
        hasPeerAssesment
      }
      tasks {
        id
        number
        points
      }
    }
  }
  ${PeerAssesmentPairFragmentDoc}
  ${PeerAssesmentOptionsFragmentDoc}
`;
export const GradeFragmentDoc = gql`
  fragment Grade on Grade {
    id
    createdAt
    updatedAt
    points
    isRevealed
    submitId
    owner {
      ...AccountDetails
    }
    comments {
      ...Comment
    }
    feedbacks {
      ...Feedback
    }
  }
  ${AccountDetailsFragmentDoc}
  ${CommentFragmentDoc}
  ${FeedbackFragmentDoc}
`;
export const SubmitFragmentDoc = gql`
  fragment Submit on Submit {
    id
    createdAt
    updatedAt
    description
    owner {
      ...AccountDetails
    }
    task {
      id
    }
    files {
      ...File
    }
    grade {
      ...Grade
    }
  }
  ${AccountDetailsFragmentDoc}
  ${FileFragmentDoc}
  ${GradeFragmentDoc}
`;
export const FieldErrorFragmentDoc = gql`
  fragment FieldError on FieldError {
    message
    fieldName
  }
`;
export const UserFragmentDoc = gql`
  fragment User on Account {
    ...AccountDetails
    username
    createdAt
    updatedAt
    email
  }
  ${AccountDetailsFragmentDoc}
`;
export const AccountResponseFragmentDoc = gql`
  fragment AccountResponse on AccountResponse {
    errors {
      ...FieldError
    }
    user {
      ...User
    }
  }
  ${FieldErrorFragmentDoc}
  ${UserFragmentDoc}
`;
export const DeleteAssignmentDocument = gql`
  mutation DeleteAssignment($id: Int!) {
    deleteAssignment(id: $id) {
      id
      course {
        id
      }
    }
  }
`;

export function useDeleteAssignmentMutation() {
  return Urql.useMutation<DeleteAssignmentMutation, DeleteAssignmentMutationVariables>(DeleteAssignmentDocument);
}
export const InsertAssignmentDocument = gql`
  mutation InsertAssignment(
    $name: String!
    $options: AssignmentOptionsInput!
    $peerAssesmentOptions: PeerAssesmentOptionsInput!
    $description: String!
    $filesToLink: [Int!]!
    $filesToDelete: [Int!]!
    $tasks: [TaskInfo!]!
    $courseId: Int!
  ) {
    insertAssignment(
      tasks: $tasks
      peerAssesmentOptions: $peerAssesmentOptions
      description: $description
      filesToLink: $filesToLink
      filesToDelete: $filesToDelete
      name: $name
      courseId: $courseId
      options: $options
    ) {
      id
      assignments {
        ...Assignment
      }
    }
  }
  ${AssignmentFragmentDoc}
`;

export function useInsertAssignmentMutation() {
  return Urql.useMutation<InsertAssignmentMutation, InsertAssignmentMutationVariables>(InsertAssignmentDocument);
}
export const UpdateAssignmentDocument = gql`
  mutation UpdateAssignment(
    $name: String!
    $options: AssignmentOptionsInput!
    $description: String!
    $peerAssesmentOptions: PeerAssesmentOptionsInput!
    $filesToLink: [Int!]!
    $filesToDelete: [Int!]!
    $tasks: [TaskInfo!]!
    $id: Int!
  ) {
    updateAssignment(
      tasks: $tasks
      peerAssesmentOptions: $peerAssesmentOptions
      description: $description
      filesToLink: $filesToLink
      filesToDelete: $filesToDelete
      name: $name
      id: $id
      options: $options
    ) {
      id
      assignments {
        ...Assignment
      }
    }
  }
  ${AssignmentFragmentDoc}
`;

export function useUpdateAssignmentMutation() {
  return Urql.useMutation<UpdateAssignmentMutation, UpdateAssignmentMutationVariables>(UpdateAssignmentDocument);
}
export const UpdatePeerAssesmentDocument = gql`
  mutation UpdatePeerAssesment($pairId: Int!, $points: Int, $description: String) {
    updatePeerAssesment(pairId: $pairId, points: $points, description: $description) {
      id
      points
      updatedAt
      description
    }
  }
`;

export function useUpdatePeerAssesmentMutation() {
  return Urql.useMutation<UpdatePeerAssesmentMutation, UpdatePeerAssesmentMutationVariables>(
    UpdatePeerAssesmentDocument
  );
}
export const DeleteCommentDocument = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
      owner {
        id
      }
      course {
        id
      }
      grade {
        id
      }
    }
  }
`;

export function useDeleteCommentMutation() {
  return Urql.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument);
}
export const InsertCommentDocument = gql`
  mutation InsertComment($content: String!, $course: Int, $grade: Int, $reveal: DateTime, $filesToLink: [Int!]) {
    insertComment(
      content: $content
      reveal: $reveal
      target: { course: $course, grade: $grade }
      filesToLink: $filesToLink
    ) {
      ...Comment
    }
  }
  ${CommentFragmentDoc}
`;

export function useInsertCommentMutation() {
  return Urql.useMutation<InsertCommentMutation, InsertCommentMutationVariables>(InsertCommentDocument);
}
export const UpdateCommentDocument = gql`
  mutation UpdateComment($id: Int!, $content: String, $reveal: DateTime, $filesToDelete: [Int!]) {
    updateComment(id: $id, content: $content, reveal: $reveal, filesToDelete: $filesToDelete) {
      ...Comment
    }
  }
  ${CommentFragmentDoc}
`;

export function useUpdateCommentMutation() {
  return Urql.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument);
}
export const InsertCourseDocument = gql`
  mutation InsertCourse($name: String!, $icon: String!, $abbreviation: String, $description: String) {
    insertCourse(name: $name, icon: $icon, abbreviation: $abbreviation, description: $description) {
      id
      icon
      createdAt
      updatedAt
      description
      abbreviation
      name
    }
  }
`;

export function useInsertCourseMutation() {
  return Urql.useMutation<InsertCourseMutation, InsertCourseMutationVariables>(InsertCourseDocument);
}
export const SignUpCourseDocument = gql`
  mutation SignUpCourse($code: String!) {
    signUpCourse(code: $code) {
      ...Course
    }
  }
  ${CourseFragmentDoc}
`;

export function useSignUpCourseMutation() {
  return Urql.useMutation<SignUpCourseMutation, SignUpCourseMutationVariables>(SignUpCourseDocument);
}
export const UpdateCourseDocument = gql`
  mutation UpdateCourse($id: Int!, $description: String, $abbreviation: String, $name: String, $icon: String) {
    updateCourse(id: $id, description: $description, abbreviation: $abbreviation, name: $name, icon: $icon) {
      id
      icon
      createdAt
      updatedAt
      description
      abbreviation
      name
    }
  }
`;

export function useUpdateCourseMutation() {
  return Urql.useMutation<UpdateCourseMutation, UpdateCourseMutationVariables>(UpdateCourseDocument);
}
export const UploadFilesDocument = gql`
  mutation uploadFiles($files: [Upload!]!, $target: FileTarget) {
    uploadFiles(files: $files, target: $target) {
      id
      filename
    }
  }
`;

export function useUploadFilesMutation() {
  return Urql.useMutation<UploadFilesMutation, UploadFilesMutationVariables>(UploadFilesDocument);
}
export const DeleteFeedbackDocument = gql`
  mutation DeleteFeedback($id: Int!) {
    deleteFeedback(id: $id) {
      id
      grade {
        id
      }
      peerAssesment {
        id
      }
    }
  }
`;

export function useDeleteFeedbackMutation() {
  return Urql.useMutation<DeleteFeedbackMutation, DeleteFeedbackMutationVariables>(DeleteFeedbackDocument);
}
export const DeleteSubmitDocument = gql`
  mutation deleteSubmit($id: Int!) {
    deleteSubmit(id: $id) {
      id
      mySubmit {
        id
      }
    }
  }
`;

export function useDeleteSubmitMutation() {
  return Urql.useMutation<DeleteSubmitMutation, DeleteSubmitMutationVariables>(DeleteSubmitDocument);
}
export const UpdateFeedbackDocument = gql`
  mutation UpdateFeedback($targetId: Int!, $childIndex: Int!, $description: String!) {
    updateFeedback(targetId: $targetId, childIndex: $childIndex, description: $description) {
      ...Feedback
    }
  }
  ${FeedbackFragmentDoc}
`;

export function useUpdateFeedbackMutation() {
  return Urql.useMutation<UpdateFeedbackMutation, UpdateFeedbackMutationVariables>(UpdateFeedbackDocument);
}
export const UpdateGradeDocument = gql`
  mutation updateGrade($submitId: Int!, $points: Float, $isRevealed: Boolean) {
    updateGrade(submitId: $submitId, data: { points: $points, isRevealed: $isRevealed }) {
      id
      grade {
        id
        points
        isRevealed
      }
    }
  }
`;

export function useUpdateGradeMutation() {
  return Urql.useMutation<UpdateGradeMutation, UpdateGradeMutationVariables>(UpdateGradeDocument);
}
export const UpdateSubmitDocument = gql`
  mutation updateSubmit($data: Info!) {
    updateSubmit(data: $data) {
      id
      mySubmit {
        ...Submit
      }
    }
  }
  ${SubmitFragmentDoc}
`;

export function useUpdateSubmitMutation() {
  return Urql.useMutation<UpdateSubmitMutation, UpdateSubmitMutationVariables>(UpdateSubmitDocument);
}
export const ChangePasswordDocument = gql`
  mutation ChangePassword($password: String!, $resetToken: String) {
    updateUser(credentials: { password: $password }, resetToken: $resetToken) {
      ...AccountResponse
    }
  }
  ${AccountResponseFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      ...AccountResponse
    }
  }
  ${AccountResponseFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
}
export const RegisterDocument = gql`
  mutation Register(
    $isTeacher: Boolean!
    $username: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $email: String
  ) {
    register(
      is_teacher: $isTeacher
      credentials: { username: $username, password: $password, email: $email }
      firstName: $firstName
      lastName: $lastName
    ) {
      ...AccountResponse
    }
    generateDummyCourse {
      ...Course
    }
  }
  ${AccountResponseFragmentDoc}
  ${CourseFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
}
export const ResetPasswordDocument = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
}
export const UpdateUserDocument = gql`
  mutation updateUser($password: String, $username: String, $firstName: String, $lastName: String, $email: String) {
    updateUser(
      credentials: { password: $password, username: $username, email: $email }
      firstName: $firstName
      lastName: $lastName
    ) {
      ...AccountResponse
    }
  }
  ${AccountResponseFragmentDoc}
`;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
}
export const CurrentUserDocument = gql`
  query currentUser {
    currentUser {
      ...User
    }
  }
  ${UserFragmentDoc}
`;

export function useCurrentUserQuery(options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, "query"> = {}) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
}
export const GetAssignmentsDocument = gql`
  query GetAssignments($courseId: Int!) {
    getAssignments(courseId: $courseId) {
      id
      assignments {
        ...Assignment
      }
    }
  }
  ${AssignmentFragmentDoc}
`;

export function useGetAssignmentsQuery(options: Omit<Urql.UseQueryArgs<GetAssignmentsQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetAssignmentsQuery>({ query: GetAssignmentsDocument, ...options });
}
export const GetCommentsDocument = gql`
  query GetComments($target: CommentTarget!) {
    getComments(target: $target) {
      ...Comment
    }
  }
  ${CommentFragmentDoc}
`;

export function useGetCommentsQuery(options: Omit<Urql.UseQueryArgs<GetCommentsQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetCommentsQuery>({ query: GetCommentsDocument, ...options });
}
export const GetCourseDocument = gql`
  query GetCourse($id: Int!) {
    getCourse(id: $id) {
      ...Course
    }
  }
  ${CourseFragmentDoc}
`;

export function useGetCourseQuery(options: Omit<Urql.UseQueryArgs<GetCourseQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetCourseQuery>({ query: GetCourseDocument, ...options });
}
export const GetCourseSubmitDetailsDocument = gql`
  query GetCourseSubmitDetails($id: Int!) {
    getCourse(id: $id) {
      id
      assignments {
        id
        name
        options {
          ...AssignmentOptions
        }
        tasks {
          id
          points
          number
          mySubmit {
            id
            updatedAt
            grade {
              id
              points
            }
          }
        }
        peerAssesment {
          id
          pairs {
            id
            points
          }
          options {
            ...PeerAssesmentOptions
          }
        }
      }
    }
  }
  ${AssignmentOptionsFragmentDoc}
  ${PeerAssesmentOptionsFragmentDoc}
`;

export function useGetCourseSubmitDetailsQuery(
  options: Omit<Urql.UseQueryArgs<GetCourseSubmitDetailsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GetCourseSubmitDetailsQuery>({ query: GetCourseSubmitDetailsDocument, ...options });
}
export const GetMyPeerAssesmentDocument = gql`
  query GetMyPeerAssesment($assignmentId: Int!) {
    getMyPeerAssesment(id: $assignmentId) {
      ...PeerAssesmentAssignment
    }
  }
  ${PeerAssesmentAssignmentFragmentDoc}
`;

export function useGetMyPeerAssesmentQuery(
  options: Omit<Urql.UseQueryArgs<GetMyPeerAssesmentQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GetMyPeerAssesmentQuery>({ query: GetMyPeerAssesmentDocument, ...options });
}
export const GetStudentsDocument = gql`
  query GetStudents($courseId: Int!) {
    getStudents(courseId: $courseId) {
      ...AccountDetails
    }
  }
  ${AccountDetailsFragmentDoc}
`;

export function useGetStudentsQuery(options: Omit<Urql.UseQueryArgs<GetStudentsQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetStudentsQuery>({ query: GetStudentsDocument, ...options });
}
export const GetSubmitDocument = gql`
  query GetSubmit($id: Int, $taskId: Int, $ownerId: Int) {
    getSubmit(id: $id, taskId: $taskId, ownerId: $ownerId) {
      id
      mySubmit {
        ...Submit
      }
    }
  }
  ${SubmitFragmentDoc}
`;

export function useGetSubmitQuery(options: Omit<Urql.UseQueryArgs<GetSubmitQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetSubmitQuery>({ query: GetSubmitDocument, ...options });
}
export const GetSubmitsDocument = gql`
  query GetSubmits($taskId: Int!) {
    getSubmits(taskId: $taskId) {
      id
      owner {
        ...AccountDetails
      }
      grade {
        id
        owner {
          ...AccountDetails
        }
        createdAt
        updatedAt
        points
        isRevealed
      }
      task {
        id
      }
    }
  }
  ${AccountDetailsFragmentDoc}
`;

export function useGetSubmitsQuery(options: Omit<Urql.UseQueryArgs<GetSubmitsQueryVariables>, "query"> = {}) {
  return Urql.useQuery<GetSubmitsQuery>({ query: GetSubmitsDocument, ...options });
}
export const GetUpcomingAssignmentsDocument = gql`
  query GetUpcomingAssignments {
    getUpcomingAssignments {
      peerAssesments {
        id
        __typename
        assignment {
          id
          name
        }
        options {
          deadline
        }
      }
      assignments {
        __typename
        id
        name
        options {
          deadline
        }
      }
    }
  }
`;

export function useGetUpcomingAssignmentsQuery(
  options: Omit<Urql.UseQueryArgs<GetUpcomingAssignmentsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GetUpcomingAssignmentsQuery>({ query: GetUpcomingAssignmentsDocument, ...options });
}
export const MyCoursesDocument = gql`
  query myCourses($offset: Int, $limit: Int) {
    getMyCourses(offset: $offset, limit: $limit) {
      ...Course
    }
  }
  ${CourseFragmentDoc}
`;

export function useMyCoursesQuery(options: Omit<Urql.UseQueryArgs<MyCoursesQueryVariables>, "query"> = {}) {
  return Urql.useQuery<MyCoursesQuery>({ query: MyCoursesDocument, ...options });
}
