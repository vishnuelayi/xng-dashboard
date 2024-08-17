import FadeIn from "./components-dev/FadeIn";
import { XNGICONS, XNGIconRenderer } from "./icons";
import XNGAvatar from "./low-level/avatar";
import XNGBack from "./low-level/button_back";
import XNGRadio from "./low-level/button_radio";
import XNGCheckbox from "./low-level/checkbox";
import XNGNotification from "./low-level/notification";
import ConfirmModal from "./modal_templates/confirm";
import { DualActionModal } from "./modal_templates/dual_action";
import { SingleActionModal } from "./modal_templates/single_action";

/**
 * Fortitude, initially aimed to be a comprehensive design system, has matured into a more focused toolkit. We are
 * now focusing on developing Fortitude to best complement our wireframe-based development and improve cohesion across
 * the XNG product and future MSB products. This file lists the essential components that form the core of Fortitude.
 * Components included here are recognized as part of the official Fortitude system. If a component isn't listed, it is
 * either an artifact of our legacy approach or not yet included.
 *
 * Your input is vital in the direction of Fortitude. If you have suggestions for new components or improvements, please
 * bring them to the team's attention for discussion. Our goal is to incorporate foundational elements that MUI doesn't
 * provide. Components that meet our collective criteria will be integrated and detailed in our official wiki (link to be added).
 */

// Simple components
export { FadeIn, XNGBack, XNGRadio, XNGCheckbox, XNGAvatar, XNGNotification };

// Iconography system
export { XNGICONS, XNGIconRenderer };

// Primitive modal templates
export { ConfirmModal, DualActionModal, SingleActionModal };
