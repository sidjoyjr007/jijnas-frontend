import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  quizStore: {},
  currentQuizId: "",
  currentSlideId: "",
  quizList: [],
  events: [],
  myQuizVisited: false,
  myEventsVisited: false,
  slides: []
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    addQuiz: (state, action) => {
      const { currentQuizId } = action?.payload;

      const quizSlideId = uuidv4();
      const totalQuizesInAQuiz = state?.slides?.[currentQuizId]
        ? Object.keys(state?.slides?.[currentQuizId])?.length
        : 0;
      return {
        ...state,
        currentSlideId: quizSlideId,
        slides: {
          ...state.slides,
          [currentQuizId]: {
            [quizSlideId]: {
              name: `Question_${quizSlideId.slice(0, 6)}`,
              changed: true
            },
            ...state.slides?.[currentQuizId]
          }
        }
      };
    },
    createNewQuiz: (state) => {
      const quizId = uuidv4();
      const slideId = uuidv4();
      const totalQuestionsInAQuiz = state?.quizStore?.[quizId]
        ? Object.keys(state?.quizStore?.[quizId])?.length
        : 0;

      return {
        ...state,
        currentQuizName: `Untitled_Quiz_${quizId}`,
        currentQuizId: quizId,
        currentSlideId: slideId,
        slides: {
          ...state.slides,
          [quizId]: {
            [slideId]: {
              name: `Question_${slideId.slice(0, 6)}`,
              changed: true
            }
          }
        }
      };
    },
    setQuizQuestion: (state, action) => {
      const { currentQuizId, currentSlideId, value, type } = action?.payload;
      return {
        ...state,
        currentSlideId,
        slides: {
          ...state.slides,
          [currentQuizId]: {
            ...state.slides?.[currentQuizId],
            [currentSlideId]: {
              ...state.slides?.[currentQuizId]?.[currentSlideId],
              [type]: value,
              changed: true
            }
          }
        }
      };
    },
    changeSlideStatus: (state, action) => {
      const { changed, currentQuizId, slideId } = action?.payload;
      return {
        ...state,
        slides: {
          ...state.slides,
          [currentQuizId]: {
            ...state.slides?.[currentQuizId],
            [slideId]: {
              ...state.slides?.[currentQuizId]?.[slideId],
              changed
            }
          }
        }
      };
    },
    addQuizOption: (state, action) => {
      const { currentQuizId, currentSlideId, options, rightAnswers } =
        action?.payload;
      return {
        ...state,
        currentSlideId,
        slides: {
          ...state.slides,
          [currentQuizId]: {
            ...state.slides?.[currentQuizId],
            [currentSlideId]: {
              ...state.slides?.[currentQuizId]?.[currentSlideId],
              options,
              rightAnswers,
              changed: true
            }
          }
        }
      };
    },
    setSlide: (state, action) => {
      const { slideId } = action?.payload;
      return {
        ...state,
        currentSlideId: slideId
      };
    },
    updateQuizName: (state, action) => {
      const { currentQuizId, currentSlideId, name } = action?.payload;

      return {
        ...state,
        slides: {
          ...state.slides,
          [currentQuizId]: {
            ...state.slides?.[currentQuizId],
            [currentSlideId]: {
              ...state.slides?.[currentQuizId]?.[currentSlideId],
              name,
              changed: true
            }
          }
        }
      };
    },
    removeQuiz: (state, action) => {
      const { currentQuizId, slideId, currentSlideId } = action?.payload;
      const { [slideId]: _, ...rest } = state?.slides?.[currentQuizId];

      let newSlideId = currentSlideId;

      if (currentSlideId === slideId) {
        const slides =
          (state?.slides?.[currentQuizId] &&
            Object.keys(state?.slides?.[currentQuizId])) ||
          [];
        if (slides?.length) {
          const findSlideIndex = slides?.findIndex((id) => id === slideId);
          if (slides[findSlideIndex - 1]) {
            newSlideId = slides[findSlideIndex - 1];
          } else if (slides[findSlideIndex + 1]) {
            newSlideId = slides[findSlideIndex + 1];
          } else {
            newSlideId = "";
          }
        }
      }

      return {
        ...state,
        slides: {
          [currentQuizId]: {
            ...rest
          }
        },
        currentSlideId: newSlideId
      };
    },
    updateCurrentQuizName: (state, action) => {
      const { quizName } = action?.payload;
      return {
        ...state,
        currentQuizName: quizName
      };
    },
    addQuizToQuizList: (state, action) => {
      const { data } = action?.payload;
      return {
        ...state,
        quizList: data,
        isMyQuizzesVisted: true
      };
    },
    removeQuizFromQuizList: (state, action) => {
      const { quizId } = action?.payload;
      const newQuizList = [...state?.quizList].filter(
        (quiz) => quizId !== quiz?.quizId
      );
      return {
        ...state,
        quizList: newQuizList
      };
    },
    addQuizToQuizstore: (state, action) => {
      const { quizId, quizName, slides } = action?.payload;
      const slidesObj = {};
      slides?.forEach((slide) => {
        slidesObj[slide?.slideId] = { ...slide, name: slide?.questionName };
      });
      return {
        ...state,
        slides: {
          [quizId]: {
            ...slidesObj
          }
        },
        currentQuizId: quizId,
        currentQuizName: quizName,
        currentSlideId: slides?.[0]?.slideId
      };
    },
    addEventToEventList: (state, action) => {
      const { data } = action?.payload;
      return {
        ...state,
        events: data,
        isMyEventsVisted: true
      };
    },
    addAIQuizzes: (state, action) => {
      const { data, currentQuizId, currentSlideId, currentQuizName } =
        action?.payload;
      return {
        ...state,
        currentQuizName,
        currentQuizId,
        currentSlideId,
        slides: {
          ...state.slides,
          ...data
        }
      };
    },
    setQuizDetails: (state, action) => {
      const { key, value } = action?.payload;
      return {
        ...state,
        [key]: value
      };
    }
  }
});

export const {
  addQuiz,
  createNewQuiz,
  setQuizQuestion,
  addQuizOption,
  setSlide,
  updateQuizName,
  removeQuiz,
  updateCurrentQuizName,
  addQuizToQuizList,
  removeQuizFromQuizList,
  addQuizToQuizstore,
  addEventToEventList,
  changeSlideStatus,
  deleteQuiz,
  addAIQuizzes,
  setQuizDetails
} = quizSlice.actions;

export default quizSlice.reducer;
