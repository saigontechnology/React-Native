interface Point {
  x: number
  y: number
}

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  const numVertices = polygon.length
  const {x, y} = point
  let inside = false

  // Store the first point in the polygon and initialize the second point
  let p1 = polygon[0]
  let p2: Point

  // Loop through each edge in the polygon
  for (let i = 1; i <= numVertices; i++) {
    // Get the next point in the polygon
    p2 = polygon[i % numVertices]

    // Check if the point is above the minimum y coordinate of the edge
    if (y > Math.min(p1.y, p2.y)) {
      // Check if the point is below the maximum y coordinate of the edge
      if (y <= Math.max(p1.y, p2.y)) {
        // Check if the point is to the left of the maximum x coordinate of the edge
        if (x <= Math.max(p1.x, p2.x)) {
          // Calculate the x-intersection of the line connecting the point to the edge
          const xIntersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x

          // Check if the point is on the same line as the edge or to the left of the x-intersection
          if (p1.x === p2.x || x <= xIntersection) {
            // Flip the inside flag
            inside = !inside
          }
        }
      }
    }

    // Store the current point as the first point for the next iteration
    p1 = p2
  }

  // Return the value of the inside flag
  return inside
}
