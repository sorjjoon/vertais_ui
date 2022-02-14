import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Icon, Tooltip } from "@chakra-ui/react";
import React from "react";
import { AssignmentFragment } from "../../generated/graphql";
import { assignmentHasActivePeerAssesment, futureDate } from "../../utils/utils";

interface MissingSubmitsIconProps {
  assignment: AssignmentFragment;
}
export const MissingSubmitsIcon: React.FC<MissingSubmitsIconProps> = ({ assignment }) => {
  var missingWorkLabel = "Kaikki tehtävät on palautettu";
  var hasMissingWork = false;
  const missingSubmits = assignment.tasks.filter((t) => !t.mySubmit && assignment.options.deadline > new Date());
  if (missingSubmits.length && (assignment.options.deadline ?? futureDate()) > new Date()) {
    hasMissingWork = true;
    missingWorkLabel = missingSubmits.map((t) => `Tehtävä ${t.number} palauttamatta`).join("\n");
  } else if (assignmentHasActivePeerAssesment(assignment)) {
    if (!assignment.peerAssesment?.pairs) {
      hasMissingWork = true;
      missingWorkLabel = "Vertaisarviointeja tekemättä";
    } else if (assignment.peerAssesment.pairs.find((p) => p.points == null) !== undefined) {
      hasMissingWork = true;
      missingWorkLabel = "Vertaisarviointeja tekemättä";
    }
  }

  return (
    <Tooltip label={missingWorkLabel}>
      <Icon
        as={hasMissingWork ? WarningTwoIcon : CheckIcon}
        color={hasMissingWork ? "yellow.600" : "green.500"}
        p={0}
        m={0}
        w={6}
        maxW="100%"
        h={6}
        maxH="100%"
      />
    </Tooltip>
  );
};

export default MissingSubmitsIcon;
