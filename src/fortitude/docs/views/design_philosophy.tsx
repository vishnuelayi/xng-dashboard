import { Stack, Typography } from "@mui/material";

export function DesignPhilosophy() {
  return (
    <>
      <Typography variant="h5">Overview</Typography>
      <Typography>
        Our design system, Fortitude, built on top of Material UI, was developed to enhance our
        wireframe-driven development process. Initially, a comprehensive design system was defined
        and is visible within Figma. While the Figma design system is thorough, the time constraints
        on our XNG project timeline, coupled with the extensive features offered by Material UI,
        guided us to focus on developing only the most essential elements. This approach shaped the
        current state of Fortitude, allowing us to optimize our resources and efficiently integrate
        the most valuable components.
      </Typography>

      <Typography variant="h5">Design Principles</Typography>
      <Typography variant="h6">
        <strong>1. Product Independence</strong>
      </Typography>
      <Typography>
        We design Fortitude components to be versatile and independent, allowing for seamless
        integration across different products. This flexibility is necessary for being able to reuse
        our design system in wireframe-driven development across a potential software suite.
      </Typography>
      <Typography variant="h6">
        <strong>2. SOLID Principles</strong>
      </Typography>
      <Stack>
        <Typography>
          SOLID principles are crucial in building a React component design system. At a broad
          glance:
        </Typography>
        <ul>
          <li>
            <b>S</b> The SRP implies that components should only do one very simple task, and larger
            components should be comprised of smaller components as per the React composition
            pattern.
          </li>
          <li>
            <b>O</b> The OCP means that components should be closed to modification (like changing
            integral functionality once a component used in more than one place), but open to
            extension (such as styling).
          </li>
          <li>
            <b>L</b> LSP means that components that do similar things should be interchangeable,
            particularly by having cohesive prop interfaces.
          </li>
          <li>
            <b>I</b> ISP means that the construction of interfaces should be built to only represent
            granular, distinct concepts, as this will promote reusability of the interfaces in other
            components. Larger interfaces comprising multiple concepts should use TypeScript union
            types.
          </li>
          <li>
            <b>D</b> DIP, of course, is assumed in React.
          </li>
        </ul>
      </Stack>
      <Typography variant="h5">Operation Guide</Typography>
      <Typography>
        For all operations that a user needs to accomplish from button clicks to using input fields,
        we leverage MUI as our default resource. In instances that an MUI component does not fit the
        needs of an operation or if a simple operation can be independently built in various complex
        ways, we consider the addition of a component to our Fortitude component library in order to
        promote reusability, testability, and codebase consistency.
      </Typography>
    </>
  );
}
