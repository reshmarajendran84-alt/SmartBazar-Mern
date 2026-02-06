import { memo } from "react";

const AddressList = ({ address }) => {
  return address.map(addr => (
    <div key={addr._id}>{addr.addressLine}</div>
  ));
};

export default memo(AddressList);
