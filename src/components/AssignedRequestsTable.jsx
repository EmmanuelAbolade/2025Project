import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaPlay, FaCheck } from "react-icons/fa";

const AssignedRequestsTable = ({ requests, updateRequestStatus, loading }) => {
  // Debugging logs to validate props
  console.log("Props passed to AssignedRequestsTable:");
  console.log("requests:", requests);
  console.log("loading:", loading);
  console.log("updateRequestStatus:", updateRequestStatus);

  // Show loading state
  if (loading) {
    return <p>Loading requests...</p>;
  }

  // Handle empty or invalid requests
  if (!requests || requests.length === 0) {
    return <p>No requests assigned. Check back later!</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date & Time</th>
          <th>Details</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => {
          // Debugging logs for each request object
          console.log("Rendering request:", request);

          return (
            <tr
              key={request.id}
              className={
                request.status === "Pending"
                  ? "table-danger"
                  : request.status === "In Progress"
                  ? "table-warning"
                  : "table-success"
              }
            >
              <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
              <td>
                {/* Handle formattedDetails properly */}
                {typeof request.formattedDetails === "object" ? (
                  // Convert map (object) to a readable string
                  Object.entries(request.formattedDetails).map(
                    ([key, value]) => (
                      <div key={key}>
                        {key}: {value.toString()}
                      </div>
                    )
                  )
                ) : (
                  request.formattedDetails || "No details available"
                )}
              </td>
              <td>
                <Badge
                  bg={
                    request.status === "Pending"
                      ? "danger"
                      : request.status === "In Progress"
                      ? "warning"
                      : "success"
                  }
                >
                  {request.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="info"
                  className="me-2 mb-2"
                  onClick={() => updateRequestStatus(request.id, "In Progress")}
                  disabled={request.status === "Completed"}
                >
                  <FaPlay /> Start
                </Button>
                <Button
                  variant="success"
                  onClick={() => updateRequestStatus(request.id, "Completed")}
                  disabled={request.status === "Completed"}
                >
                  <FaCheck /> Complete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default AssignedRequestsTable;
