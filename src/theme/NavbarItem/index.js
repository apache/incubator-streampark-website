import React from 'react';
import ComponentTypes from '@theme/NavbarItem/ComponentTypes';

function normalizeComponentType(type, props) {
  // Backward compatibility: navbar item with no type set
  // but containing dropdown items should use the type "dropdown"
  if (!type || type === 'default') {
    return 'items' in props ? 'dropdown' : 'default';
  }
  return type;
}
export default function NavbarItem({ type, ...props }) {
  const componentType = normalizeComponentType(type, props);
  const NavbarItemComponent = ComponentTypes[componentType];
  if (!NavbarItemComponent) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }

  return <NavbarItemComponent {...props} />;
}
