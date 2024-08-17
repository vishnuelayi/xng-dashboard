import ProviderNotFoundError from "../high-level/Error/ProviderNotFoundError";
import RemoveProviderConfirmationModal from "./RemoveProviderConfirmationModal";
import { SimpleAttentionModal } from "./SimpleAttentionModal";
import ThankYouModal from "./ThankYouModal";

const AppWideModals = () => {
  return (
    <>
      <ProviderNotFoundError />
      <ThankYouModal />
      <RemoveProviderConfirmationModal />
      <SimpleAttentionModal />
    </>
  );
};

export default AppWideModals;
