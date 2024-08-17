// I found this function here: https://stackoverflow.com/questions/45408920/plain-javascript-scrollintoview-inside-div
// I made a slight adjustment that changes scrollTop to use scrollTo for better UX
export function scrollParentToChild(parent: HTMLElement, child: HTMLElement) {
  // Where is the parent on page
  var parentRect = parent?.getBoundingClientRect();
  // What can you see?
  var parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  // Where is the child
  var childRect = child.getBoundingClientRect();
  // Is the child viewable?
  var isViewable =
    childRect.top >= parentRect.top && childRect.top <= parentRect.top + parentViewableArea.height;

  // if you can't see the child try to scroll parent
  if (!isViewable) {
    // scroll by offset relative to parent
    parent.scrollTo({
      top: childRect.top + parent.scrollTop - parentRect.top,
      left: 0,
      behavior: "smooth",
    });
  }
}
