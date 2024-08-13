import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  // mutate -> untuk menjalankan http request misal ke server
  //isPending -> ketika request ke server apakah masih loading atau sudah beres
  //isError -> jika ada error ketika request
  //error -> informasi/pesan error
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please check your input and try again later."
          }
        />
      )}
    </Modal>
  );
}
