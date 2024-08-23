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
  addVaccinationEntry: () =>
    set((state) => ({
      vaccinationEntries: [
        ...state.vaccinationEntries,
        { id: Date.now(), name: '', date: '' }
      ]
    })),
  updateVaccinationEntry: (id, field, value) =>
    set((state) => ({
      vaccinationEntries: state.vaccinationEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
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
