import { Table, TabPanel, Box, Tbody, Td, Th, Thead, Tr, VStack, Button } from "@chakra-ui/react";
import React from "react";
import {
  useGetAssignmentsQuery,
  useGetCourseSubmitDetailsQuery,
  useGetStudentsQuery,
  UserRole,
} from "../../../generated/graphql";
import { CsvWriter } from "../../../utils/csv";
import { countOccurances, entityKey, formatDate, uuid } from "../../../utils/utils";
import ErrorMessage from "../../errormessage";
import { useCurrentCourse } from "../../providers/courseprovider";
import { useCurrentUser } from "../../providers/userprovider";
import Loading from "../../utils/loading";
import LoginRequired from "../../utils/loginrequired";

export const SummaryPanel: React.FC = ({}) => {
  const user = useCurrentUser();
  const course = useCurrentCourse();

  return (
    <LoginRequired>
      <Loading isLoading={course === undefined}>
        <Box w="100%" overflowX="auto">
          <Box w="max-content" minW="100%" minH="10em">
            {user?.role === UserRole.Student ? <StudentSummaryPanel /> : <TeacherSummaryPanel />}
          </Box>
        </Box>
      </Loading>
    </LoginRequired>
  );
};

export default SummaryPanel;

const TeacherSummaryPanel: React.FC = ({}) => {
  const course = useCurrentCourse();

  const [getAssisgnmentsState] = useGetAssignmentsQuery({ variables: { courseId: course?.id ?? 0 } });
  const [getStudentsState] = useGetStudentsQuery({ variables: { courseId: course?.id ?? 0 } });

  if (getAssisgnmentsState.fetching || getStudentsState.fetching) return <Loading></Loading>;

  if (getAssisgnmentsState.error ?? getStudentsState.error)
    return <ErrorMessage message={getAssisgnmentsState.error ?? getStudentsState.error}> </ErrorMessage>;

  const assignments = getAssisgnmentsState.data?.getAssignments?.assignments ?? [];
  const students = getStudentsState.data?.getStudents ?? [];

  const csvData: Map<string, string | number | null>[] = [];
  assignments.forEach((a) => {
    const hasOneTask = a.tasks.length === 1;
    students.forEach((s) => {
      const row = new Map<string, string | number | null>();
      csvData.push(row);

      row.set("Opiskelija", `${s.lastName}, ${s.firstName}`);
      row.set("id", s.id);

      a.tasks.forEach((t) => {
        const submit = t.submits.find((sub) => sub.owner.id === s.id);
        if (hasOneTask) {
          row.set(a.name, submit?.grade?.points ?? null);
        } else {
          row.set(`${a.name} - tehtävä ${t.number}`, submit?.grade?.points ?? null);
        }
      });
      if (a.options.hasPeerAssesment) {
        row.set(
          `${a.name} - vertaisarviointi`,
          countOccurances(
            (a.peerAssesment?.pairs ?? []).filter((p) => p.assessor.id === s.id),
            (p) => p.points != null
          )
        );
      }
    });
  });
  const rowKeys = Array.from(csvData[0].keys()).filter((k) => k !== "id");
  return (
    <VStack w="max-content" spacing={8} p={2}>
      <Box w="100%">
        <Button
          ml="auto"
          onClick={() => {
            const csvWriter = new CsvWriter({ decimalSeparator: ".", delimiter: "," });
            csvWriter.appendRow(...csvData);
            csvWriter.setHeaders(rowKeys);

            const csvString = csvWriter.stringify();
            //Byte order mark for utf-8, for excel
            const dataUrl = "data:text/csv;charset=utf-8," + "\ufeff" + encodeURI(csvString);
            const tempLink = document.createElement("a");
            tempLink.setAttribute("href", dataUrl);
            tempLink.setAttribute("download", `${course?.name}-arvosanat-${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(tempLink); // Required for FF

            tempLink.click();
          }}
        >
          Lataa csv
        </Button>
      </Box>
      <Table className="summary-table" variant="striped">
        <Thead>
          <Tr>
            {rowKeys.map((k) => (
              <Th key={k}>{k}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {csvData.map((row) => {
            return (
              <Tr key={row.get("id")}>
                {rowKeys.map((k) => (
                  <Td key={k}>{row.get(k)}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
};

const StudentSummaryPanel: React.FC = ({}) => {
  const course = useCurrentCourse();
  const [queryState] = useGetCourseSubmitDetailsQuery({ variables: { id: course?.id ?? 0 } });
  if (queryState.fetching) return <Loading></Loading>;
  if (queryState.error) return <ErrorMessage message={queryState.error}> </ErrorMessage>;
  const data = queryState.data?.getCourse?.assignments;
  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Tehtävän nimi</Th>
          <Th>Palautuspäivä</Th>
          <Th>Palautettu</Th>
          <Th>Arviointi</Th>
          <Th>Vertaisarvioinnin palautuspäivä</Th>
          <Th>Vertaisarviointeja tekemättä</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((row) => {
          const isOnlyTask = row.tasks.length === 1;
          return row.tasks.map((t) => (
            <Tr key={t.id}>
              <Td>{isOnlyTask ? row.name : `${row.name} - tehtävä ${t.number}`}</Td>
              <Td>{formatDate(row.options.deadline, { default: "Ei palautuspäivää", addPostFix: true })} </Td>
              <Td>{formatDate(t.mySubmit?.updatedAt, { default: "Ei palautettu", addPostFix: true })} </Td>
              <Td>{t.mySubmit?.grade?.points ?? "Ei arvioitu"} </Td>
              <Td>
                {formatDate(row.peerAssesment?.options.deadline, { default: "Ei vertaisarviointia", addPostFix: true })}{" "}
              </Td>
              <Td>{countOccurances(row.peerAssesment?.pairs ?? [], (x) => x.points == null)} </Td>
            </Tr>
          ));
        })}
      </Tbody>
    </Table>
  );
};
