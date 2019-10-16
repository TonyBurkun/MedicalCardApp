import {SET_NOTES} from '../actions/notes'
import {ADD_NOTE} from '../actions/notes'
import {UPDATE_NOTE} from '../actions/notes'
import {DELETE_NOTE} from '../actions/notes'


const initialState = {
  notesList:[],
};


function notes (state = initialState, action) {

  switch (action.type) {

    case SET_NOTES:
      return {
        ...state,
        notesList: action.notesList
      };

    case ADD_NOTE:
      let newNote = action.note;
      let noteID = newNote.id;
      let notes = Object.assign(state.notesList, {[noteID]: newNote});

      return (
        {
          ...state,
          notesList: notes
        }
      );

    case UPDATE_NOTE:

      let updatedNote = action.note;
      Object.keys(state.notesList).filter((item) => {
        if (state.notesList[item].id === updatedNote.id) {
          state.notesList[item] = updatedNote;
        }
      });

      return {
        ...state,
        notesList: state.notesList
      };

    case DELETE_NOTE:
      let deletedNoteID = action.noteID;
      const notesList = state.notesList;
      delete notesList[deletedNoteID];


      return {
        ...state,
        notesList: notesList
      };

    default:
      return state
  }
}

export default notes;
