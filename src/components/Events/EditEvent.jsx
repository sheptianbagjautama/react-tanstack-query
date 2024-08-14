import {
  Link,
  redirect,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  //state useNavigation untuk mengetahui status route yang active apakah loading atau bagaimana
  const { state } = useNavigation();
  const submit = useSubmit();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000,
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   //onMutate akan di panggil ketika mutate()function di jalankan
  //   //params data ini otomatis ada karena di function handle submit menjalankan mutate dengan object params id dan event
  //   onMutate: async (data) => {
  //     const newEvent = data.event;

  //     await queryClient.cancelQueries({ queryKey: ["events", params.id] });
  //     //state lama , untuk keperluan jika mutate gagal data di kembalikan ke data sebelumnya
  //     const previousEvent = queryClient.getQueryData(["events", params.id]);
  //     queryClient.setQueriesData(["events", params.id], newEvent);

  //     //previousEvent ini akan menjadi context di params onError
  //     return { previousEvent };
  //   },
  //   //ketika mutation gagal
  //   onError: (error, data, context) => {
  //     console.log("masuk on error");
  //     queryClient.setQueryData(["events", params.id], context.previousEvent);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(["events", params.id]);
  //   },
  // });

  function handleSubmit(formData) {
    //params ini bisa digunakan contohnya di function onMutate diatas
    // mutate({ id: params.id, event: formData });

    //cara kedua , submit function ini akan memicu function action di bawah
    submit(formData, { method: "PUT" });
    console.log("state", state);
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to load event. Please check your inputs and try again later."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Sending data...</p>
        ) : (
          <>
            {" "}
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
  //fetch data menggunakan fetcQuery
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  //fetch semua yang key queris nya events
  await queryClient.invalidateQueries(["events"]);
  return redirect("../");
}
