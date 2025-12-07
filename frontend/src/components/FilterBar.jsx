// import { FiSearch, FiMic } from "react-icons/fi";
// import { useRef, useState, useEffect, useCallback } from "react";
// import { getTaskDetailsFromText, getAllTasks } from "../services/tasks";
// // Debounce helper function
// const debounce = (func, delay) => {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => func.apply(this, args), delay);
//   };
// };

// const FilterBar = ({ onAdd, setScript, setTasks }) => {
//   const recognitionRef = useRef(null);
//   const [listening, setListening] = useState(false);
//   const [filters, setFilters] = useState({
//     searchQuery: "",
//     status: "All Status",
//     priority: "All Priority",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch tasks with current filters
//   const fetchFilteredTasks = useCallback(
//     async (filters) => {
//       setIsLoading(true);
//       try {
//         // Build query params
//         const params = {};

//         if (filters.searchQuery) {
//           params.search = filters.searchQuery;
//         }

//         if (filters.status !== "All Status") {
//           params.status = filters.status;
//         }

//         if (filters.priority !== "All Priority") {
//           params.priority = filters.priority;
//         }

//         // Make API call with filters
//         // Note: You'll need to update your getAllTasks function to accept params
//         const response = await getAllTasks(params);
//         const fetchedTasks = response.data.data || response.data;
//         setTasks(fetchedTasks);
//       } catch (error) {
//         console.error("Failed to fetch filtered tasks:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [setTasks]
//   );

//   // Debounced fetch function
//   const debouncedFetchFilteredTasks = useCallback(
//     debounce((filters) => {
//       fetchFilteredTasks(filters);
//     }, 500),
//     [fetchFilteredTasks]
//   );

//   // Fetch tasks on initial load
//   useEffect(() => {
//     fetchFilteredTasks(filters);
//   }, []);

//   // Apply filters when they change (with debounce for search)
//   useEffect(() => {
//     debouncedFetchFilteredTasks(filters);
//   }, [filters, debouncedFetchFilteredTasks]);

//   const handleVoice = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser");
//       return;
//     }

//     if (!recognitionRef.current) {
//       const recognition = new SpeechRecognition();
//       recognitionRef.current = recognition;

//       recognition.lang = "en-US";
//       recognition.continuous = false;
//       recognition.interimResults = false;

//       recognition.onstart = () => setListening(true);
//       recognition.onend = () => setListening(false);

//       recognition.onerror = (e) => {
//         console.error("Speech error:", e);
//         setListening(false);
//       };

//       recognition.onresult = async (event) => {
//         const spokenText = event.results[0][0].transcript;
//         console.log("🎙️ Voice Input:", spokenText);
//         try {
//           const response = await getTaskDetailsFromText({
//             text: spokenText,
//           });

//           onAdd();
//           setScript(response.data.task);
//         } catch (error) {
//           console.error("❌ Voice task parse failed:", error);
//         }
//       };
//     }

//     listening ? recognitionRef.current.stop() : recognitionRef.current.start();
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setFilters((prev) => ({
//       ...prev,
//       searchQuery: value,
//     }));
//   };

//   const handleStatusChange = (e) => {
//     const value = e.target.value;
//     setFilters((prev) => ({
//       ...prev,
//       status: value,
//     }));
//   };

//   const handlePriorityChange = (e) => {
//     const value = e.target.value;
//     setFilters((prev) => ({
//       ...prev,
//       priority: value,
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       searchQuery: "",
//       status: "All Status",
//       priority: "All Priority",
//     });
//   };
//   return (
//     <div className="flex items-center justify-between mt-4">
//       {/* Search */}
//       <div className="flex items-center bg-slate-800 px-4 py-3 rounded-xl w-[380px] relative">
//         <FiSearch className="text-slate-400 text-lg mr-3" />
//         <input
//           type="text"
//           placeholder="Search tasks..."
//           className="bg-transparent outline-none text-slate-200 placeholder:text-slate-500 w-full pr-8"
//           value={filters.searchQuery}
//           onChange={handleSearchChange}
//           disabled={isLoading}
//         />
//         {isLoading && (
//           <div className="absolute right-3">
//             <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}
//         {filters.searchQuery && !isLoading && (
//           <button
//             onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
//             className="text-slate-400 hover:text-white ml-2"
//             disabled={isLoading}
//           >
//             ✕
//           </button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4">
//         <select
//           className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl outline-none border border-slate-700 disabled:opacity-50"
//           value={filters.status}
//           onChange={handleStatusChange}
//           disabled={isLoading}
//         >
//           <option value="All Status">All Status</option>
//           <option value="To Do">To Do</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Done">Done</option>
//         </select>

//         <select
//           className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl outline-none border border-slate-700 disabled:opacity-50"
//           value={filters.priority}
//           onChange={handlePriorityChange}
//           disabled={isLoading}
//         >
//           <option value="All Priority">All Priority</option>
//           <option value="Low Priority">Low</option>
//           <option value="High Priority">High</option>
//           <option value="Urgent">Urgent</option>
//           <option value="Critical">Critical</option>
//         </select>

//         {/* Clear Filters Button */}
//         <button
//           onClick={clearFilters}
//           className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
//           disabled={isLoading}
//         >
//           Clear Filters
//         </button>
//         {/* 🎙️ Voice Button */}
//         <button
//           onClick={handleVoice}
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white disabled:opacity-50
//             ${
//               listening
//                 ? "bg-red-500 animate-pulse"
//                 : "bg-green-500 hover:bg-green-600"
//             }`}
//           disabled={isLoading}
//         >
//           <FiMic />
//           {listening ? "Listening..." : "Voice"}
//         </button>

//         {/* + Add Task */}
//         <button
//           onClick={() => onAdd?.()}
//           className="flex items-center gap-2 bg-green-500 px-4 py-2 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
//           disabled={isLoading}
//         >
//           + Add Task
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FilterBar;

import { FiSearch, FiMic, FiX, FiStopCircle } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { useRef, useState, useEffect, useCallback } from "react";
import { getTaskDetailsFromText, getAllTasks } from "../services/tasks";

// Debounce helper function
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const FilterBar = ({ onAdd, setScript, setTasks }) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "All Status",
    priority: "All Priority",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. Please allow microphone access to use voice features."
        );
      }
    };

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      if (final) {
        setTranscript((prev) => prev + " " + final);
        setInterimTranscript("");
      }

      if (interim) {
        setInterimTranscript(interim);
      }
    };

    return recognition;
  }, []);

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    if (recognitionRef.current) {
      try {
        setTranscript("");
        setInterimTranscript("");
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Failed to stop recognition:", error);
      }
    }
  };

  // Handle voice button click - opens modal
  const handleVoiceButtonClick = () => {
    setShowVoiceModal(true);
    setTranscript("");
    setInterimTranscript("");
  };

  // Process the transcript
  const handleProcessTranscript = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const response = await getTaskDetailsFromText({
        text: transcript,
      });

      onAdd?.();
      setScript?.(response.data.task);

      // Close modal
      setShowVoiceModal(false);
      setTranscript("");
      setInterimTranscript("");
    } catch (error) {
      console.error("❌ Voice task parse failed:", error);
      alert("Failed to process voice input. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Close modal and cleanup
  const handleCloseModal = () => {
    stopListening();
    setShowVoiceModal(false);
    setTranscript("");
    setInterimTranscript("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Fetch tasks with current filters
  const fetchFilteredTasks = useCallback(
    async (filters) => {
      setIsLoading(true);
      try {
        // Build query params
        const params = {};

        if (filters.searchQuery) {
          params.search = filters.searchQuery;
        }

        if (filters.status !== "All Status") {
          params.status = filters.status;
        }

        if (filters.priority !== "All Priority") {
          params.priority = filters.priority;
        }

        // Make API call with filters
        const response = await getAllTasks(params);
        const fetchedTasks = response.data.data || response.data;
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch filtered tasks:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setTasks]
  );

  // Debounced fetch function
  const debouncedFetchFilteredTasks = useCallback(
    debounce((filters) => {
      fetchFilteredTasks(filters);
    }, 500),
    [fetchFilteredTasks]
  );

  // Fetch tasks on initial load
  useEffect(() => {
    fetchFilteredTasks(filters);
  }, []);

  // Apply filters when they change (with debounce for search)
  useEffect(() => {
    debouncedFetchFilteredTasks(filters);
  }, [filters, debouncedFetchFilteredTasks]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      searchQuery: value,
    }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      status: "All Status",
      priority: "All Priority",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        {/* Search */}
        <div className="flex items-center bg-slate-800 px-4 py-3 rounded-xl w-[380px] relative">
          <FiSearch className="text-slate-400 text-lg mr-3" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent outline-none text-slate-200 placeholder:text-slate-500 w-full pr-8"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {filters.searchQuery && !isLoading && (
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, searchQuery: "" }))
              }
              className="text-slate-400 hover:text-white ml-2"
              disabled={isLoading}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl outline-none border border-slate-700 disabled:opacity-50"
            value={filters.status}
            onChange={handleStatusChange}
            disabled={isLoading}
          >
            <option value="All Status">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl outline-none border border-slate-700 disabled:opacity-50"
            value={filters.priority}
            onChange={handlePriorityChange}
            disabled={isLoading}
          >
            <option value="All Priority">All Priority</option>
            <option value="Low Priority">Low</option>
            <option value="High Priority">High</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Clear Filters
          </button>

          {/* 🎙️ Voice Button */}
          <button
            onClick={handleVoiceButtonClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white disabled:opacity-50
              bg-green-500 hover:bg-green-600`}
            disabled={isLoading}
          >
            <FiMic />
            Voice
          </button>

          {/* + Add Task */}
          <button
            onClick={() => onAdd?.()}
            className="flex items-center gap-2 bg-green-500 px-4 py-2 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
            disabled={isLoading}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Voice Input Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    listening ? "bg-red-500 animate-pulse" : "bg-green-500"
                  }`}
                >
                  <FiMic className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Voice Input
                  </h3>
                  <p className="text-sm text-slate-400">
                    Speak to create a task
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Status Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Status</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        listening ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-slate-300">
                      {listening ? "Listening..." : "Not Listening"}
                    </span>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={startListening}
                    disabled={listening}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      listening
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    <FaPlay />
                    Start
                  </button>
                  <button
                    onClick={stopListening}
                    disabled={!listening}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      !listening
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    <FiStopCircle />
                    Stop
                  </button>
                </div>
              </div>

              {/* Transcript Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Transcript
                </label>
                <div className="bg-slate-900 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
                  {transcript ? (
                    <p className="text-white whitespace-pre-wrap">
                      {transcript}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic">
                      {listening
                        ? "Speak now..."
                        : "Click Start to begin speaking"}
                    </p>
                  )}
                  {interimTranscript && (
                    <p className="text-slate-400 italic mt-2">
                      <span className="text-green-400">Live:</span>{" "}
                      {interimTranscript}
                    </p>
                  )}
                </div>
              </div>

              {/* Hint */}
              <div className="bg-slate-900/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-slate-300">
                    Try saying:
                  </span>{" "}
                  "Create a task to finish the report by tomorrow with high
                  priority"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-slate-300 hover:text-white"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleProcessTranscript}
                disabled={!transcript.trim() || isProcessing}
                className={`px-4 py-2 rounded-lg text-white ${
                  !transcript.trim() || isProcessing
                    ? "bg-green-500/50 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
