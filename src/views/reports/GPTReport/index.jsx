import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Card from "components/Card";
import Table from "./GPTReportTable";
import Input from "components/Input";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { IconButton } from "@mui/material";
import { postGPTReportAPI } from "services/v2/gptreport";
import { useMutation } from "@tanstack/react-query";
import { TextGenerator } from "components/TextGenerator";

export default function GPTReport() {
  const { t } = useTranslation();
  const [promptText, setPromptText] = useState("");
  const [data, setData] = useState(null);
  const [errorText, setErrorText] = useState("");

  const mutation = useMutation({
    mutationFn: postGPTReportAPI,
    onSuccess: (res) => {
      setData(res.data?.data);
    },
    onError: (error) => setErrorText(error?.response?.data?.data),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ prompt: promptText });
  };

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <Header title={t("gpt-report")} />
      <div style={{ flex: 1, minHeight: "80vh" }}>
        <Card className="m-4">
          {!mutation.isLoading &&
          !mutation.isError &&
          data?.rows?.length > 0 ? (
            <Table data={data} />
          ) : mutation.isError ? (
            errorText ? (
              <TextGenerator text={errorText} interval={50} />
            ) : (
              <p style={{ textAlign: "center" }}>Something went wrong...</p>
            )
          ) : (
            <p style={{ textAlign: "center" }}>
              {mutation.isLoading ? "loading..." : "GPT Report"}
            </p>
          )}
        </Card>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex sticky bottom-0 justify-end items-center w-full bg-white px-4 py-2"
      >
        <Input
          placeholder="Send a message"
          value={promptText}
          onChange={({ target: { value } }) => setPromptText(value)}
        />
        <IconButton
          aria-label="send"
          onClick={() => mutation.mutate({ prompt: promptText })}
        >
          <SendRoundedIcon color="primary" />
        </IconButton>
      </form>
    </div>
  );
}
