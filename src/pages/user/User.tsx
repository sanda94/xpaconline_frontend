import Single from "../../components/single/Single";
import "./user.scss";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const User = () => {
  const params = useParams();
  console.log(params);

  let navigate = useNavigate();

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      navigate("/users/" + params.id);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="user">
      <Single />
    </div>
  );
};

export default User;
