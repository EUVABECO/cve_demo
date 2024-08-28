import create from 'zustand';

const useStore = create((set) => ({
  firstName: '',
  lastName: '',
  birthdate: '',
  vaccinationEntries: [],
  formStatus: { success: false, error: false },
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setBirthdate: (birthdate) => set({ birthdate }),
  addVaccinationEntry: (nuvaId, date) =>
    set((state) => ({
      vaccinationEntries: [
        ...state.vaccinationEntries,
        { id: Date.now(), nuvaId, date }
      ]
    })),
  setFormStatus: (formStatus) => set({ formStatus }),
  resetForm: () =>
    set({
      firstName: '',
      lastName: '',
      birthdate: '',
      vaccinationEntries: [],
      formStatus: { success: false, error: false }
    })
}));

export default useStore;
