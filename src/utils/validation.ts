import * as Yup from "yup";
declare module "yup" {
  interface StringSchema {
    noAtSign(err: string): StringSchema;
  }
}

const minUsername = 3;
const maxUsername = 100;

const minPassword = 5;
const maxPassword = 100;

Yup.addMethod(Yup.string, "noAtSign", function (errorMessage) {
  return this.test(`noAtSign`, errorMessage, function (value) {
    const { path, createError } = this;

    return !value?.includes("@") || createError({ path, message: errorMessage });
  });
});

export const UserInfoSchema = Yup.object().shape({
  username: Yup.string()
    .min(minUsername, formatMinError(minUsername))
    .max(maxUsername, formatMaxError(maxUsername))
    .required("Pakollinen")
    .noAtSign("Käyttäjänimi ei saa sisältää @ merkkiä"),

  firstName: Yup.string().max(50, "Suurin sallittu pituus on 50 merkkiä").required("Pakollinen"),
  lastName: Yup.string().max(50, "Suurin sallittu pituus on 50 merkkiä").required("Pakollinen"),

  email: Yup.string().email("Epäkelpo sähköposti"),
});

export const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(minPassword, "Salasanan täytyy olla vähintään 5 merkkiä")
    .required("Pakollinen")
    .max(maxPassword, formatMaxError(maxPassword)),
  password2: Yup.string()
    .required("Pakollinen")
    .when(["password"], (password, schema) => {
      return schema.oneOf([password], "Salasanat eivät täsmää");
    }),
});
export const SignupSchema = Yup.object().concat(UserInfoSchema).concat(PasswordSchema);

export const CodeSchema = Yup.object().shape({
  code: Yup.string().length(4, "Kurssikoodin pituus on aina 4 merkkiä"),
});
export const GradeSchema = Yup.object().shape({
  studentGrades: Yup.array().of(
    Yup.object().shape({
      isRevealed: Yup.boolean(),
      points: Yup.number().when("isRevealed", (isRevealed, schema) => {
        return isRevealed ? schema.required("Pisteitä ei asetettu") : schema.min(0);
      }),
    })
  ),
});
export const GradeSchemasa = Yup.object().shape({
  studentGrades: Yup.array().of(
    Yup.object().shape({
      isRevealed: Yup.boolean(),
      points: Yup.number().when("isRevealed", {
        is: (val: any) => {
          console.log(val);
          return !!val;
        },
        then: Yup.number().required("Pisteitä ei asetettu"),
        otherwise: Yup.number().required("Pisteitä ei asetettu"),
      }),
    })
  ),
});

export const AssignmentOptionsSchema = Yup.object().shape({
  name: Yup.string().required("Pakollinen"),

  options: Yup.object().shape({
    hasPeerAssesment: Yup.boolean().required(),
    noDeadline: Yup.boolean()
      .required()
      .when("hasPeerAssesment", {
        is: true,
        then: Yup.boolean().oneOf([false], "Vertaisarviointia varten palautuspäivän tulee olla asetettu"),
        otherwise: Yup.boolean(),
      }),
    deadline: Yup.date().when("noDeadline", {
      is: false,
      then: Yup.date().required().min(new Date(), "Palautuspäivän täytyy olla tulevaisuudessa"),
      otherwise: Yup.date(),
    }),
  }),

  peerAssesmentOptions: Yup.object().when("options.hasPeerAssesment", {
    is: true,
    then: Yup.object().shape({
      peerAssesmentCount: Yup.number()
        .integer("Vertaisarviointien määrän täytyy olla kokonaisluku")
        .required("Pakollinen")
        .moreThan(0, "Vertaisarviointien määrän täytyy olla positiivinen"),
      deadline: Yup.date()
        .required("Vertaisarvionnin palautuspäivä puuttuu")
        .min(new Date(), "Vertaisarvionnin palautuspäivän täytyy olla tulevaisuudessa"),
      // .min(Yup.ref("options.deadline"), "Vertaisarvionnin palautuspäivä ei voi olla ennen tehtävän palautuspäivää"),
      //Doesn't work for some reason?
    }),
    otherwise: Yup.object(),
  }),
  tasks: Yup.array()
    .of(
      Yup.object().shape({
        points: Yup.number()
          .integer("Pisteiden määrän täytyy olla kokonaisluku")
          .required("Pakollinen")
          .min(0, "Pisteiden täytyy olla vähintään 0"),
      })
    )
    .min(1, "Tehtäviä tulee olla vähintään 1"),
  // .when("options.hasPeerAssesment", {
  //   is: true,
  //   then: Yup.object()
  //   otherwise: Yup.object(),
  // }),
});

function formatMinError(min: number) {
  return "Pituuden täytyy olla vähintään " + min + " merkkiä";
}

function formatMaxError(max: number) {
  return "Pituus saa olla enintään " + max + " merkkiä";
}
