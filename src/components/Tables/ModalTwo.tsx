import { useState, useEffect, useRef } from "react";

interface ModalTwoProps {
  searchId: string;
  onClose: () => void;
}

interface Package {
  _id: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  FROM_NUMBER: string;
  APP_NUMBER: string;
  YOUR_NUMBER: string;
  OPENAI_API_KEY: string;
  DEEPGRAM_API_KEY: string;
  GROQ_API_KEY: string;
  VOICE_MODEL: string;
  RECORDING_ENABLED: string;
}

const ModalTwo: React.FC<ModalTwoProps> = ({ searchId, onClose }) => {
  const [data, setData] = useState<Package | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (!token) {
          throw new Error("No token found.");
        }

        const response = await fetch(`https://ai-call-assistant.fly.dev/api/env/${encodeURIComponent(searchId)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (searchId) {
      fetchData();
    }
  }, [searchId]);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[60vh] overflow-hidden"
        style={{ overflowY: "scroll", scrollbarWidth: "none", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
      >
        <h2 className="text-center text-xl font-semibold mb-4 dark:text-white">
          Agent Details
        </h2>
        {data ? (
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Agent Name</span>
              <span>{data._id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Twilio SID</span>
              <span>{data.TWILIO_ACCOUNT_SID}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Twilio Token</span>
              <span>{data.TWILIO_AUTH_TOKEN}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">From Number</span>
              <span>{data.FROM_NUMBER}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">App Number</span>
              <span>{data.APP_NUMBER}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Your Number</span>
              <span>{data.YOUR_NUMBER}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Deepgram API Key</span>
              <span>{data.DEEPGRAM_API_KEY}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">GROQ API Key</span>
              <span>{data.GROQ_API_KEY}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Voice Model</span>
              <span>{data.VOICE_MODEL}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Recording Enabled</span>
              <span>{data.RECORDING_ENABLED}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-50 rounded-full p-2"
          style={{ color: "grey", fontSize: "x-large", fontWeight: "bold" }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ModalTwo;
