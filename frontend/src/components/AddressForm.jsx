import { useState } from "react";
import { addAddress } from "../services/userService";

const AddressForm = ({ onSuccess }) => {
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
    isDefault: false
  });

  const submit = async () => {
    await addAddress(data);
    alert("Address added");
    onSuccess();
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="font-semibold mb-2">Add Address</h2>

      {["fullName", "phone", "addressLine", "city", "pincode"].map((f) => (
        <input
          key={f}
          className="border p-2 w-full mb-2"
          placeholder={f}
          onChange={(e) => setData({ ...data, [f]: e.target.value })}
        />
      ))}

      <label className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          onChange={(e) =>
            setData({ ...data, isDefault: e.target.checked })
          }
        />
        Set as default
      </label>

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Address
      </button>
    </div>
  );
};

export default AddressForm;
