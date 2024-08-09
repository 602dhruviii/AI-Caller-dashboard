"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const FormElements = () => {
  const [formData, setFormData] = useState({
    Agent_Name: "",
    TWILIO_ACCOUNT_SID: "",
    TWILIO_AUTH_TOKEN: "",
    FROM_NUMBER: "",
    APP_NUMBER: "",
    DEEPGRAM_API_KEY: "",
    GROQ_API_KEY: "",
    VOICE_MODEL: "",
    RECORDING_ENABLED: false,
    content: "",
    seccont: "",
  });

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "info" | null;
    message: string;
  } | null>(null);
  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/signup");
      }
    };
    fetchStatus();
  });
  const optionsArray = [
    { value: "aura-asteria-en", label: "aura-asteria-en (Female)" },
    { value: "aura-luna-en", label: "aura-luna-en (Female)" },
    { value: "aura-stella-en", label: "aura-stella-en (Female)" },
    { value: "aura-athena-en", label: "aura-athena-en (Female)" },
    { value: "aura-hera-en", label: "aura-hera-en (Female)" },
    { value: "aura-orion-en", label: "aura-orion-en (Male)" },
    { value: "aura-arcas-en", label: "aura-arcas-en (Male)" },
    { value: "aura-perseus-en", label: "aura-perseus-en (Male)" },
    { value: "aura-angus-en", label: "aura-angus-en (Male)" },
    { value: "aura-orpheus-en", label: "aura-orpheus-en (Male)" },
    { value: "aura-helios-en", label: "aura-helios-en (Male)" },
  ];

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      // For text areas and selects
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setAlert({
        type: "warning",
        message: "You must be logged in to update environment variables",
      });
      return;
    }

    // Validation: Check if any field is empty
    const hasEmptyFields = Object.entries(formData)
      .filter(([key]) => key !== "RECORDING_ENABLED") // Exclude RECORDING_ENABLED
      .some(([_, value]) => value === "" || value === false); // Check for empty fields

    if (hasEmptyFields) {
      setAlert({
        type: "info",
        message:
          "All fields except RECORDING_ENABLED must be filled before submission",
      });
      return;
    }

    try {
      let success = true;

      // First API call
      const responseEnv = await fetch(
        "https://ai-assistant-caller.fly.dev/api/update-env",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (responseEnv.ok) {
        // Second API call
        const responseContent = await fetch(
          "https://ai-assistant-caller.fly.dev/setUserContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: formData.content,
              seccont: formData.seccont,
            }),
          },
        );

        if (responseContent.ok) {
          setAlert({
            type: "success",
            message:
              "Environment variables and user content updated successfully",
          });
        } else {
          const resultContent = await responseContent.json();
          setAlert({
            type: "warning",
            message: "Error updating user content: " + resultContent.error,
          });
        }
      } else {
        const resultEnv = await responseEnv.json();
        setAlert({
          type: "warning",
          message: "Error updating environment variables: " + resultEnv.error,
        });
      }
    } catch (error) {
      setAlert({
        type: "warning",
        message: "Error updating data: " + (error as Error).message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h2
                className="font-medium text-black dark:text-white"
                style={{ textAlign: "center" }}
              >
                CREATE AGENT
              </h2>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Agent Name
                </label>
                <input
                  type="text"
                  name="Agent_Name"
                  placeholder="Enter Agent Name"
                  className="agentName w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.Agent_Name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Twilio SID
                </label>
                <input
                  type="text"
                  name="TWILIO_ACCOUNT_SID"
                  placeholder="Enter Twilio SID"
                  className="twilioSid w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.TWILIO_ACCOUNT_SID}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Twilio Token
                </label>
                <input
                  type="text"
                  name="TWILIO_AUTH_TOKEN"
                  placeholder="Enter Twilio Token"
                  className="twilioToken w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.TWILIO_AUTH_TOKEN}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Deepgram API_Key
                </label>
                <input
                  type="text"
                  name="DEEPGRAM_API_KEY"
                  placeholder="Enter Deepgram api_key"
                  className="deepgramApiKey w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.DEEPGRAM_API_KEY}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Groq API_Key
                </label>
                <input
                  type="text"
                  name="GROQ_API_KEY"
                  placeholder="Enter Groq api_key"
                  className="groqApiKey w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.GROQ_API_KEY}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  From Number
                </label>
                <input
                  type="text"
                  name="FROM_NUMBER"
                  placeholder="Enter number (+countrycodenumber eg: +918700659586)"
                  className="fromNumber w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.FROM_NUMBER}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  App Number
                </label>
                <input
                  type="text"
                  name="APP_NUMBER"
                  placeholder="Enter number (+countrycodenumber eg: +918700659586)"
                  className="appNumber w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.APP_NUMBER}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Assistant Instructions
                </label>
                <textarea
                  rows={6}
                  name="content"
                  placeholder="Enter Assistant Instructions"
                  className="botStory w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.content}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Greeting Sentence
                </label>
                <input
                  type="text"
                  name="seccont"
                  placeholder="Enter the phrase you'd like the Assistant to lead with"
                  className="greetSen w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.seccont}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="checkboxLabelTwo"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="checkboxLabelTwo"
                      name="RECORDING_ENABLED"
                      checked={formData.RECORDING_ENABLED}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                        formData.RECORDING_ENABLED &&
                        "border-primary bg-gray dark:bg-transparent"
                      }`}
                    >
                      <span
                        className={`opacity-0 ${formData.RECORDING_ENABLED && "!opacity-100"}`}
                      >
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#3056D3"
                            stroke="#3056D3"
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                  Record Audio
                </label>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Choose Voice Assistant
                </label>

                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="VOICE_MODEL"
                    value={selectedOption}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setFormData((prevData) => ({
                        ...prevData,
                        VOICE_MODEL: e.target.value,
                      }));
                      changeTextColor();
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary ${
                      isOptionSelected ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option
                      value=""
                      disabled
                      className="text-body dark:text-bodydark"
                    >
                      Select your Assistant
                    </option>
                    {optionsArray.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 14L8 10H16L12 14ZM12 16L16 12H8L12 16Z"
                        fill="#5A5F7D"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
              <div></div>
              <div>
                <button
                  type="submit"
                  className="w-full rounded bg-primary py-3 text-center text-base font-semibold text-white transition hover:bg-opacity-90"
                >
                  Submit
                </button>
              </div>
              <div>
                {alert && (
                  <div
                    className={`flex w-full border-l-6 px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9 ${alert.type === "success" ? "border-[#34D399] bg-[#34D399] bg-opacity-[15%]" : "border-[#F87171] bg-[#F87171] bg-opacity-[15%]"}`}
                  >
                    <div
                      className={`mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg ${alert.type === "success" ? "bg-[#34D399]" : "bg-[#F87171]"}`}
                    >
                      <svg
                        width={alert.type === "success" ? "16" : "13"}
                        height={alert.type === "success" ? "12" : "13"}
                        viewBox={
                          alert.type === "success" ? "0 0 16 12" : "0 0 13 13"
                        }
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {alert.type === "success" ? (
                          <path
                            d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                            fill="white"
                            stroke="white"
                          />
                        ) : (
                          <path
                            d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2645C1.74553 12.4128 1.52971 12.5 1.32625 12.5C1.12265 12.5 0.903564 12.4128 0.754029 12.2645C0.433597 11.9445 0.433743 11.4317 0.754032 11.1114C0.754032 11.1114 0.754032 11.1114 0.754032 11.1114C0.754032 11.1112 0.754032 11.1112 0.754032 11.1111L5.30964 6.53968L0.744317 1.91143C0.745487 1.91015 0.746799 1.90877 0.748339 1.90741C0.945716 1.73598 1.21035 1.66228 1.44882 1.66858C1.44885 1.66858 1.44888 1.66858 1.44891 1.66858L1.45455 1.66869L6.49168 6.68834L6.4917 7.65579Z"
                            fill="white"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="w-full">
                      <p
                        style={{
                          color: "var(--tw-text-opacity)",
                          fontWeight: "700",
                          marginTop: "0.5%",
                        }}
                      >
                        {alert.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormElements;
