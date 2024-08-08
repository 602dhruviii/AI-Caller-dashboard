import { useState, useEffect, useRef } from "react";
import { Package } from "@/types/package";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Package | null;
}

const Modal = ({ isOpen, onClose, data }: ModalProps) => {
  const [formData, setFormData] = useState<Package>({
    _id: "",
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
    callCount: "",
    createdAt: "",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>(
    formData.VOICE_MODEL,
  );
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

  useEffect(() => {
    if (data) {
      setFormData(data);
      setSelectedOption(data.VOICE_MODEL);
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      if (modalRef.current) {
        const scrollTop = modalRef.current.scrollTop;
        const scrollHeight = modalRef.current.scrollHeight;
        const clientHeight = modalRef.current.clientHeight;
        setScrollPercentage((scrollTop / (scrollHeight - clientHeight)) * 100);
      }
    };

    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener("scroll", handleScroll);
      return () => modal.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: target.checked,
      }));
    } else if (type === "select-one") {
      const target = e.target as HTMLSelectElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: target.value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement | HTMLTextAreaElement).value,
      }));
    }

    if (name === "VOICE_MODEL") {
      setSelectedOption((e.target as HTMLSelectElement).value);
    }
  };

  const handleEdit = async (id: string, updatedData: Partial<Package>) => {
    try {
      const response = await fetch(`https://ai-assistant-caller.fly.dev/api/env/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the authorization token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({ type: "success", message: "Agent updated successfully" });
        onClose(); // Close the modal after successful update
        window.location.reload();
        // Optionally reload data or trigger a parent update
        // window.location.reload(); // Reload the page to reflect changes
      } else {
        setAlert({
          type: "error",
          message: result.message || "Failed to update agent",
        });
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      setAlert({ type: "error", message: "Error updating agent" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData._id) {
      handleEdit(formData._id, formData);
    } else {
      setAlert({ type: "error", message: "No ID found for the agent" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div
        ref={modalRef}
        className="relative max-h-[60vh] w-full max-w-lg overflow-hidden rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark"
        style={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <h2 className="mb-4 text-center text-xl font-semibold dark:text-white">
          Edit Agent
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                      From Number
                    </label>
                    <input
                      type="text"
                      name="FROM_NUMBER"
                      placeholder="Enter From Number"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                      placeholder="Enter App Number"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.APP_NUMBER}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Deepgram API Key
                    </label>
                    <input
                      type="text"
                      name="DEEPGRAM_API_KEY"
                      placeholder="Enter Deepgram API Key"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.DEEPGRAM_API_KEY}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Groq API Key
                    </label>
                    <input
                      type="text"
                      name="GROQ_API_KEY"
                      placeholder="Enter Groq API Key"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.GROQ_API_KEY}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Choose Voice Assistant
                    </label>

                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="VOICE_MODEL"
                        onChange={handleChange}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary ${
                          selectedOption ? "text-black dark:text-white" : ""
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

                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Recording Enabled
                    </label>
                    <input
                      type="checkbox"
                      name="RECORDING_ENABLED"
                      className="rounded border-stroke bg-transparent text-primary focus:ring-0 dark:border-strokedark dark:bg-form-input"
                      checked={formData.RECORDING_ENABLED}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          RECORDING_ENABLED: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Content
                    </label>
                    <textarea
                      name="content"
                      placeholder="Enter Content"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Second Content
                    </label>
                    <textarea
                      name="seccont"
                      placeholder="Enter Second Content"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.seccont}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full rounded bg-primary py-3 text-center text-base font-semibold text-white transition hover:bg-opacity-90"
                    >
                      Submit
                    </button>
                  </div>
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
                              d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.28371 0.747996 6.65165L4.95188 11.5578L4.97849 11.5874L4.99936 11.5986C5.33859 11.9923 6.00088 12.0002 6.37623 11.6487L15.4086 2.07257C15.7654 1.69191 15.7748 1.06893 15.4445 0.67672C15.1781 0.37579 14.7586 0.245871 14.328 0.382328L14.3174 0.389773C14.1436 0.410762 13.9817 0.486796 13.8471 0.590504L15.2984 0.826822Z"
                              fill="#fff"
                            />
                          ) : (
                            <path
                              d="M6.454 8.454c-.204 0-.402-.051-.573-.147L1.147 5.02C.894 4.746.894 4.246 1.147 3.97c.204-.204.504-.283.78-.283.279 0 .568.091.78.283L7.5 6.35l5.078-5.075a.788.788 0 0 1 .566-.227c.253 0 .487.095.672.274.183.179.278.417.278.67s-.095.487-.278.67L7.043 8.307c-.171.172-.369.25-.58.25z"
                              fill="#fff"
                            />
                          )}
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {alert.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              type="button"
              className="text-gray-600 dark:text-gray-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
