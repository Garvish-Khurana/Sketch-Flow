export function serializeForSave(nodes, edges) {
  return {
    nodes: nodes.map(({ id, position, data = {}, type }) => {
      const {
        // common text/appearance
        label,
        description,
        color,
        textColor,
        shape,
        width,
        height,
        fontFamily,
        fontSize,
        fontWeight,
        italic,
        underline,
        // status orb
        emoji,
        sub,
        progress,
        status,
        // media
        imageUrl,
        imageFit,
        scrim,
        // stickers
        variant,
        text,
        // shapes / backgrounds
        backgroundType,
        texture,
        tilt,
      } = data;

      return {
        id,
        position,
        title: label,
        type,
        data: {
          label,
          description,
          color,
          textColor,
          shape,
          width,
          height,
          fontFamily,
          fontSize,
          fontWeight,
          italic,
          underline,
          backgroundType,
          texture,
          tilt,
          // status orb fields
          emoji,
          sub,
          progress,
          status,
          // media
          imageUrl,
          imageFit,
          scrim,
          // sticker fields
          variant,
          text,
        },
      };
    }),
    edges: edges.map(({ id, source, target, type }) => ({
      id,
      source,
      target,
      type: type || 'rough',
    })),
  };
}

export function serializeForCreate(name, nodes, edges) {
  return {
    title: name,
    name,
    ...serializeForSave(nodes, edges),
  };
}
