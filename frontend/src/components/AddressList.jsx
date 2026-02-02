import {
  deleteAddress,
  setDefaultAddress
} from "../services/userService";

const AddressList = ({ addresses, onChange }) => {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Saved Addresses</h2>

      {addresses.map((a) => (
        <div
          key={a._id}
          className="border p-3 rounded flex justify-between"
        >
          <div>
            <p className="font-medium">
              {a.fullName} {a.isDefault && "(Default)"}
            </p>
            <p>{a.addressLine}</p>
            <p>{a.city} - {a.pincode}</p>
          </div>

          <div className="space-x-2">
            {!a.isDefault && (
              <button
                onClick={async () => {
                  await setDefaultAddress(a._id);
                  onChange();
                }}
                className="text-blue-600"
              >
                Make Default
              </button>
            )}
            <button
              onClick={async () => {
                await deleteAddress(a._id);
                onChange();
              }}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
