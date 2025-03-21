import React, { useState, useEffect } from "react";
import { Serializer, Model, ChoicesRestful } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import "./index.css";
import { json } from "./json";

Serializer.addProperty("dropdown", {
  name: "setDefaultFirstValue",
  type: "boolean",
  category: "general",
  default: false,
});

function SurveyComponent() {
  const [survey, setSurvey] = useState(null);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyODE1Nzk0LWRlODYtNDU3OS04OWNiLWU4NGI5YTNkMWIzNiIsImVtYWlsIjoibmFoYW1tZWRAc21hcnQtaW5mcmFzdHJ1Y3R1cmUuY29tIiwibmFtZSI6Im5paGFsIGFoYW1tZWQiLCJwdXJwb3NlIjoiYWNjZXNzIHRva2VuIiwiYXBwbGljYXRpb25Sb2xlIjoiZWNhMjQ2MjEtMmMzMC00NTYzLWIyNWItYmJmNDViMTg1MDc3IiwicHJvamVjdFJvbGVJZHMiOltdLCJpYXQiOjE3MTkyMzY0NDJ9.K5sqQat0AwE6I28fjbZuA-8H7H-kSJLjeiU6hMBx82k";
  // ChoicesRestful.onBeforeSendRequest = (_, options) => {
  //   options.request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
  // };

  // survey.onValueChanged.add((sender, options) => {
  //   console.log("Value Changed: ", options);
  //   if (options.name === "sampleId" && options.value) {
  //     fetchSampleData(options.value, accessToken).then((data) => {
  //       console.log("Sample Data: ", data);
  //       if (data) {
  //         sender.setValue("materialTypeId", data.materialTypeId);
  //         sender.setValue("materialId", data.materialId);
  //         sender.setValue("testNo", "1234");
  //       }
  //     });
  //   }
  // });
  // survey.onComplete.add((sender, options) => {
  //   console.log(JSON.stringify(sender.data, null, 3));
  // });

  useEffect(() => {
    const surveyModel = new Model(json);

    // 2️⃣ Apply authorization header to API requests for dropdown choices
    ChoicesRestful.onBeforeSendRequest = (_, options) => {
      options.request.setRequestHeader(
        "Authorization",
        `Bearer ${accessToken}`
      );
    };

    // 3️⃣ Set default values if "setDefaultFirstValue" is enabled
    surveyModel.onSurveyLoad((sender) => {
      sender.getAllQuestions().forEach((question) => {
        if (question.getType() === "dropdown") {
          console.log(question.getPropertyValue("setDefaultFirstValue"));
          const setFirst = question.getPropertyValue("setDefaultFirstValue");
          if (setFirst && question.choices.length > 0) {
            sender.setValue(question.name, question.choices[0].value);
          }
        }
      });
    });

    // 4️⃣ Handle changes when sampleId is updated
    surveyModel.onValueChanged.add((sender, options) => {
      console.log("Value Changed: ", options);
      if (options.name === "sampleId" && options.value) {
        fetchSampleData(options.value, accessToken).then((data) => {
          console.log("Sample Data: ", data);
          if (data) {
            sender.setValue("materialTypeId", data.materialTypeId);
            sender.setValue("materialId", data.materialId);
            sender.setValue("testNo", "1234");
          }
        });
      }
    });

    // 5️⃣ Handle survey completion
    surveyModel.onComplete.add((sender) => {
      console.log("Survey Data:", JSON.stringify(sender.data, null, 3));
    });

    setSurvey(surveyModel);
  }, []);
  if (!survey) return <p>Loading survey...</p>;
  return <Survey model={survey} />;
}

export default SurveyComponent;
