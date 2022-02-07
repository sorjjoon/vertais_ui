import {
  Box,
  Collapse,
  Divider,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";
import ReactDatePicker from "react-datepicker";
import Checkboxinput from "./checkboxinput";
import DateInput from "./dateinput";
import NumberInputfield from "./numberinput";

interface AssignmentOptionsInputProps {}
export const AssignmentOptionsInput: React.FC<AssignmentOptionsInputProps> = ({}) => {
  const [noDeadlineField] = useField<boolean>({ name: "options.noDeadline" });

  const [revealNowField] = useField<boolean>({ name: "options.revealNow" });

  const [hasPeerAssesmentField] = useField<boolean>({ name: "options.hasPeerAssesment" });

  return (
    <VStack align="baseline" spacing={4} w="100%">
      <Heading size="md">Asetukset</Heading>
      <VStack align="flex-start">
        <Heading fontSize="1.0em">Palautuspäivä: </Heading>
        <Checkboxinput name="options.noDeadline" label="Ei palautuspäivää" />
        <Collapse in={!noDeadlineField.value} animateOpacity>
          <DateInput name="options.deadline" label="Palautuspäivä" hideLabel />
        </Collapse>
      </VStack>

      <VStack align="flex-start">
        <Heading fontSize="1.0em">Näkyy opiskelijoille: </Heading>
        <Checkboxinput name="options.revealNow" label="Heti" />
        <Collapse in={!revealNowField.value} animateOpacity>
          <DateInput name="options.reveal" label="Palautus näkyy opiskelijoille" hideLabel />
        </Collapse>
      </VStack>
      <Divider />
      <Heading size="md">Vertaisarvioinnin asetukset: </Heading>
      <VStack align="flex-start" spacing={4}>
        <Checkboxinput name="options.hasPeerAssesment" label="Lisää vertaisarviointi" />
        <Collapse in={hasPeerAssesmentField.value} animateOpacity>
          <VStack align="flex-start" spacing={4}>
            <VStack align="flex-start" spacing={1}>
              <NumberInputfield label="Vertaisarviointien lukumäärä" name="peerAssesmentOptions.peerAssesmentCount" />
            </VStack>
            <VStack align="flex-start" spacing={1}>
              <Text>Vertaisarvioinnin palautuspäivä</Text>
              <DateInput name="peerAssesmentOptions.deadline" label="Palautus näkyy opiskelijoille" hideLabel />
            </VStack>
          </VStack>
        </Collapse>
      </VStack>
    </VStack>
  );
};

export default AssignmentOptionsInput;
