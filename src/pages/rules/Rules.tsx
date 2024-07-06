import { useState, useEffect } from "react";
import "./rules.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RuleFormPopup from "../../components/RuleFormPopup/RuleFormPopup";
import { useTheme } from "../../contexts/ThemeContext";

const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", flex: 1 },
  {
    field: "img",
    headerName: "Image",
    flex: 1,
    renderCell: (params) => {
      return <img src={params.row.img || "/ruleb.svg"} alt="" />;
    },
  },
  {
    field: "userId",
    type: "string",
    headerName: "User Id",
    flex: 1,
  },
  {
    field: "deviceId",
    type: "string",
    headerName: "Device Id",
    flex: 1,
  },
  {
    field: "emailStatus",
    type: "string",
    headerName: "Email Status",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    type: "string",
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    type: "string",
  },
];

const Rules = () => {
  const { themeColors } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [UserType, SetUserType] = useState("");

  // Rules data
  const [RulesData, SetRulesData] = useState([]);

  // Status
  const [Status, SetStatus] = useState("none");
  console.log(Status);

  let navigate = useNavigate();

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      navigate("/rules");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchRules();

    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      SetUserType(storedUser.userType);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [isFormOpen]);

  // Fetch devices
  const fetchRules = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/rules/all",
          { headers }
        );
        console.log(response.data.rules);
        SetRulesData(response.data.rules);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  const updateStatus = (val: string) => {
    console.log("sfsfaafagsgsg");
    fetchRules();
    SetStatus(val);
  };

  return (
    <div className="products">
      <div className="info">
        <h1 style={{ color: themeColors.mainColor }}>All Rules</h1>
        {UserType == "admin" ? (
          <button onClick={openForm}>Add New Rule</button>
        ) : null}
      </div>
      {RulesData.length > 0 ? (
        <DataTable
          slug="rules"
          statusChange={updateStatus}
          columns={columns}
          rows={RulesData}
        />
      ) : (
        <p>No Data Available...</p>
      )}

      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="products" columns={columns} rows={data} />
      )} */}
      <RuleFormPopup
        isOpen={isFormOpen}
        onClose={closeForm}
        update={false}
        ruleId=""
      />
    </div>
  );
};

export default Rules;
