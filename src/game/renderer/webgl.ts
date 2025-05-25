import { isPowerOf2 } from "@/engine/util/math";
import { Rgba } from "@/engine/math/rgba";
import { Pnt3Like } from "@/engine/math/pnt3";
import { Direction } from "@/engine/math/direction";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

type ColorRGB = [number, number, number, number];

enum ReflectionModel {
  ANISTROPIC,
  BLINN_PHONG,
  LAMBERT,
  PHONG,
}

export class Material {
  private reflectionModel: ReflectionModel = ReflectionModel.LAMBERT;
  private ambientColor: ColorRGB | null = null;
  private ambientMap: CanvasImageSource | null = null;
  private diffuseColor: ColorRGB | null = null;
  private diffuseMap: CanvasImageSource | null = null;
  private specularColor: ColorRGB | null = null;
  private specularMap: CanvasImageSource | null = null;
  private opacityColor: ColorRGB | null = null;
  private opacityMap: CanvasImageSource | null = null;
  private emissiveColor: ColorRGB | null = null;
  private emissiveMap: CanvasImageSource | null = null;
  private bumpColor: ColorRGB | null = null;
  private bumpMap: CanvasImageSource | null = null;
  private normalColor: ColorRGB | null = null;
  private normalMap: CanvasImageSource | null = null;
  private cubeColor: ColorRGB | null = null;
  private cubeMap: CanvasImageSource | null = null;
  private dirtMap: CanvasImageSource | null = null;
  private ambientLight: number = 0.0;
  private glossiness: number = 0.0;
  private opacity: number = 1.0;
  private normalFactory: number = 1.0;
  private reflection: number = 0.0;
  private refractionIndex: number = 1.0;
  private roughness: number = 0.0;
}

type MeshData = {
  vertices: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
};

type Face = {
  vertices: { x: number; y: number; z: number }[];
  uvs: { u: number; v: number }[];
  normal: Pnt3Like;
};

const Triangle = {
  vertices: [
    { x: 1.0, y: -1.0, z: 0.0 },
    { x: -1.0, y: -1.0, z: 0.0 },
    { x: 0.0, y: 1.0, z: 0.0 },
  ],
};

const Cube = {
  faces: {
    LEFT: {
      vertices: [
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 1 },
        { x: 0, y: 0, z: 1 },
      ],
      uvs: [
        { u: 0, v: 1 },
        { u: 0, v: 0 },
        { u: 1, v: 1 },
        { u: 1, v: 0 },
      ],
      normal: Direction.LEFT,
    },
    RIGHT: {
      vertices: [
        { x: 1, y: 1, z: 1 },
        { x: 1, y: 0, z: 1 },
        { x: 1, y: 1, z: 0 },
        { x: 1, y: 0, z: 0 },
      ],
      uvs: [
        { u: 0, v: 1 },
        { u: 0, v: 0 },
        { u: 1, v: 1 },
        { u: 1, v: 0 },
      ],
      normal: Direction.RIGHT,
    },
    BOTTOM: {
      vertices: [
        { x: 1, y: 0, z: 1 },
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ],
      uvs: [
        { u: 1, v: 0 },
        { u: 0, v: 0 },
        { u: 1, v: 1 },
        { u: 0, v: 1 },
      ],
      normal: Direction.DOWN,
    },
    TOP: {
      vertices: [
        { x: 0, y: 1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 1, z: 0 },
      ],
      uvs: [
        { u: 1, v: 1 },
        { u: 0, v: 1 },
        { u: 1, v: 0 },
        { u: 0, v: 0 },
      ],
      normal: Direction.UP,
    },
    BACK: {
      vertices: [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 0, y: 1, z: 0 },
      ],
      uvs: [
        { u: 0, v: 0 },
        { u: 1, v: 0 },
        { u: 0, v: 1 },
        { u: 1, v: 1 },
      ],
      normal: Direction.BACKWARD,
    },
    FRONT: {
      vertices: [
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 },
        { x: 0, y: 1, z: 1 },
        { x: 1, y: 1, z: 1 },
      ],
      uvs: [
        { u: 0, v: 0 },
        { u: 1, v: 0 },
        { u: 0, v: 1 },
        { u: 1, v: 1 },
      ],
      normal: Direction.FORWARD,
    },

    direction(direction: Pnt3Like): Face {
      switch (direction) {
        case Direction.LEFT:
          return Cube.faces.LEFT;
        case Direction.RIGHT:
          return Cube.faces.RIGHT;
        case Direction.DOWN:
          return Cube.faces.BOTTOM;
        case Direction.UP:
          return Cube.faces.TOP;
        case Direction.BACKWARD:
          return Cube.faces.BACK;
        case Direction.FORWARD:
          return Cube.faces.FRONT;
        default:
          throw `Unknown direction: ${direction}`;
      }
    },

    all(): Face[] {
      return [
        Cube.faces.LEFT,
        Cube.faces.RIGHT,
        Cube.faces.BOTTOM,
        Cube.faces.TOP,
        Cube.faces.BACK,
        Cube.faces.FRONT,
      ];
    },
  },
};

type WebGLInstancedArraysContext = {
  drawArrays(
    mode: GLenum,
    first: GLint,
    count: GLsizei,
    instanceCount: GLsizei,
  ): void;
  drawElements(
    mode: GLenum,
    count: GLsizei,
    type: GLenum,
    offset: GLintptr,
    instanceCount: GLsizei,
  ): void;
};

type WebGLVertexArrayObjectContext = {
  createVertexArrayObject(): WebGLVertexArrayObject | null;
  deleteVertexArrayObject(vao: WebGLVertexArrayObject): void;
  bindVertexArrayObject(vao: WebGLVertexArrayObject | null): void;
};

type WebGLDrawBuffersContext = {
  readonly COLOR_ATTACHMENT0: 0x8ce0;
  readonly COLOR_ATTACHMENT1: 0x8ce1;
  readonly COLOR_ATTACHMENT2: 0x8ce2;
  readonly COLOR_ATTACHMENT3: 0x8ce3;
  readonly COLOR_ATTACHMENT4: 0x8ce4;
  readonly COLOR_ATTACHMENT5: 0x8ce5;
  readonly COLOR_ATTACHMENT6: 0x8ce6;
  readonly COLOR_ATTACHMENT7: 0x8ce7;
  readonly COLOR_ATTACHMENT8: 0x8ce8;
  readonly COLOR_ATTACHMENT9: 0x8ce9;
  readonly COLOR_ATTACHMENT10: 0x8cea;
  readonly COLOR_ATTACHMENT11: 0x8ceb;
  readonly COLOR_ATTACHMENT12: 0x8cec;
  readonly COLOR_ATTACHMENT13: 0x8ced;
  readonly COLOR_ATTACHMENT14: 0x8cee;
  readonly COLOR_ATTACHMENT15: 0x8cef;
  readonly DRAW_BUFFER0: 0x8825;
  readonly DRAW_BUFFER1: 0x8826;
  readonly DRAW_BUFFER2: 0x8827;
  readonly DRAW_BUFFER3: 0x8828;
  readonly DRAW_BUFFER4: 0x8829;
  readonly DRAW_BUFFER5: 0x882a;
  readonly DRAW_BUFFER6: 0x882b;
  readonly DRAW_BUFFER7: 0x882c;
  readonly DRAW_BUFFER8: 0x882d;
  readonly DRAW_BUFFER9: 0x882e;
  readonly DRAW_BUFFER10: 0x882f;
  readonly DRAW_BUFFER11: 0x8830;
  readonly DRAW_BUFFER12: 0x8831;
  readonly DRAW_BUFFER13: 0x8832;
  readonly DRAW_BUFFER14: 0x8833;
  readonly DRAW_BUFFER15: 0x8834;
  readonly MAX_COLOR_ATTACHMENTS: 0x8cdf;
  readonly MAX_DRAW_BUFFERS: 0x8824;
  drawBuffers(buffers: GLenum[]): void;
};

enum WebGLShaderType {
  VERTEX = WebGLRenderingContext.VERTEX_SHADER,
  FRAGMENT = WebGLRenderingContext.FRAGMENT_SHADER,
}

enum WebGLExtension {
  ANGLE_INSTANCED_ARRAYS = "ANGLE_instanced_arrays",
  OES_VERTEX_ARRAY_OBJECT = "OES_vertex_array_object",
  OES_ELEMENT_INDEX_UINT = "OES_element_index_uint",
  WEBGL_DRAW_BUFFERS = "WEBGL_draw_buffers",
  WEBGL_PROVOKING_VERTEX = "WEBGL_provoking_vertex",
}

type WEBGL_provoking_vertex = {
  readonly FIRST_VERTEX_CONVENTION_WEBGL: 0x8e4d;
  readonly LAST_VERTEX_CONVENTION_WEBGL: 0x8e4e; // Default
  readonly PROVOKING_VERTEX_WEBGL: 0x8e4f;
  provokingVertexWEBGL(provokeMode: GLenum): void;
};

type WebGLExtensionMap = {
  [WebGLExtension.ANGLE_INSTANCED_ARRAYS]: ANGLE_instanced_arrays;
  [WebGLExtension.OES_VERTEX_ARRAY_OBJECT]: OES_vertex_array_object;
  [WebGLExtension.OES_ELEMENT_INDEX_UINT]: OES_element_index_uint;
  [WebGLExtension.WEBGL_DRAW_BUFFERS]: WEBGL_draw_buffers;
  [WebGLExtension.WEBGL_PROVOKING_VERTEX]: WEBGL_provoking_vertex;
};

enum WebGLVertexAttribType {
  FLOAT,
}

enum WebGLUniformType {
  INT,
  FLOAT,
  VEC4,
  MAT4,
}

type WebGLVertexBuffer = {
  buffer: WebGLBuffer;
  size: GLint;
};

enum WebGLIndexBufferType {
  UNSIGNED_BYTE = WebGLRenderingContext.UNSIGNED_BYTE,
  UNSIGNED_SHORT = WebGLRenderingContext.UNSIGNED_SHORT,
  UNSIGNED_INT = WebGLRenderingContext.UNSIGNED_INT,
}

type WebGLIndexBuffer = {
  buffer: WebGLBuffer;
  type: WebGLIndexBufferType;
};

type WebGLGBuffer = {
  framebuffer: WebGLFramebuffer;
  position: WebGLTexture;
  normal: WebGLTexture;
  color: WebGLTexture;
  depth: WebGLTexture;
};

enum WebGLDrawMode {
  POINTS = WebGLRenderingContext.POINTS,
  LINES = WebGLRenderingContext.LINES,
  LINE_STRIP = WebGLRenderingContext.LINE_STRIP,
  LINE_LOOP = WebGLRenderingContext.LINE_LOOP,
  TRIANGLES = WebGLRenderingContext.TRIANGLES,
  TRIANGLE_STRIP = WebGLRenderingContext.TRIANGLE_STRIP,
  TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN,
}

export class WebGL {
  private readonly isWebGL2: boolean;
  private readonly instancedArrays: WebGLInstancedArraysContext;
  private readonly vertexArrayObject: WebGLVertexArrayObjectContext;
  private readonly drawBuffers: WebGLDrawBuffersContext;

  constructor(
    private readonly gl: WebGLRenderingContext,
    /**
     * Enables/disables validation and error checking that may block the rendering pipeline.
     */
    private readonly debug = false,
  ) {
    if (gl instanceof WebGL2RenderingContext) {
      this.isWebGL2 = true;
      const provokingVertexExt = WebGL.getOptionalExtension(
        gl,
        WebGLExtension.WEBGL_PROVOKING_VERTEX,
      );

      if (provokingVertexExt !== null) {
        provokingVertexExt.provokingVertexWEBGL(
          provokingVertexExt.FIRST_VERTEX_CONVENTION_WEBGL,
        );
      }

      this.instancedArrays = {
        drawArrays: gl.drawArraysInstanced.bind(gl),
        drawElements: gl.drawElementsInstanced.bind(gl),
      };
      this.vertexArrayObject = {
        createVertexArrayObject: gl.createVertexArray.bind(gl),
        deleteVertexArrayObject: gl.deleteVertexArray.bind(gl),
        bindVertexArrayObject: gl.bindVertexArray.bind(gl),
      };
      this.drawBuffers = {
        COLOR_ATTACHMENT0: gl.COLOR_ATTACHMENT0,
        COLOR_ATTACHMENT1: gl.COLOR_ATTACHMENT1,
        COLOR_ATTACHMENT10: gl.COLOR_ATTACHMENT10,
        COLOR_ATTACHMENT11: gl.COLOR_ATTACHMENT11,
        COLOR_ATTACHMENT12: gl.COLOR_ATTACHMENT12,
        COLOR_ATTACHMENT13: gl.COLOR_ATTACHMENT13,
        COLOR_ATTACHMENT14: gl.COLOR_ATTACHMENT14,
        COLOR_ATTACHMENT15: gl.COLOR_ATTACHMENT15,
        COLOR_ATTACHMENT2: gl.COLOR_ATTACHMENT2,
        COLOR_ATTACHMENT3: gl.COLOR_ATTACHMENT3,
        COLOR_ATTACHMENT4: gl.COLOR_ATTACHMENT4,
        COLOR_ATTACHMENT5: gl.COLOR_ATTACHMENT5,
        COLOR_ATTACHMENT6: gl.COLOR_ATTACHMENT6,
        COLOR_ATTACHMENT7: gl.COLOR_ATTACHMENT7,
        COLOR_ATTACHMENT8: gl.COLOR_ATTACHMENT8,
        COLOR_ATTACHMENT9: gl.COLOR_ATTACHMENT9,
        DRAW_BUFFER0: gl.DRAW_BUFFER0,
        DRAW_BUFFER1: gl.DRAW_BUFFER1,
        DRAW_BUFFER10: gl.DRAW_BUFFER10,
        DRAW_BUFFER11: gl.DRAW_BUFFER11,
        DRAW_BUFFER12: gl.DRAW_BUFFER12,
        DRAW_BUFFER13: gl.DRAW_BUFFER13,
        DRAW_BUFFER14: gl.DRAW_BUFFER14,
        DRAW_BUFFER15: gl.DRAW_BUFFER15,
        DRAW_BUFFER2: gl.DRAW_BUFFER2,
        DRAW_BUFFER3: gl.DRAW_BUFFER3,
        DRAW_BUFFER4: gl.DRAW_BUFFER4,
        DRAW_BUFFER5: gl.DRAW_BUFFER5,
        DRAW_BUFFER6: gl.DRAW_BUFFER6,
        DRAW_BUFFER7: gl.DRAW_BUFFER7,
        DRAW_BUFFER8: gl.DRAW_BUFFER8,
        DRAW_BUFFER9: gl.DRAW_BUFFER9,
        MAX_COLOR_ATTACHMENTS: gl.MAX_COLOR_ATTACHMENTS,
        MAX_DRAW_BUFFERS: gl.MAX_DRAW_BUFFERS,
        drawBuffers: gl.drawBuffers.bind(gl),
      };
    } else {
      this.isWebGL2 = false;
      WebGL.getRequiredExtension(gl, WebGLExtension.OES_ELEMENT_INDEX_UINT);
      const instancedExt = WebGL.getRequiredExtension(
        gl,
        WebGLExtension.ANGLE_INSTANCED_ARRAYS,
      );
      const vaoExt = WebGL.getRequiredExtension(
        gl,
        WebGLExtension.OES_VERTEX_ARRAY_OBJECT,
      );
      const drawBuffersExt = WebGL.getRequiredExtension(
        gl,
        WebGLExtension.WEBGL_DRAW_BUFFERS,
      );
      this.instancedArrays = {
        drawArrays: instancedExt.drawArraysInstancedANGLE.bind(gl),
        drawElements: instancedExt.drawElementsInstancedANGLE.bind(gl),
      };
      this.vertexArrayObject = {
        createVertexArrayObject: vaoExt.createVertexArrayOES.bind(gl),
        deleteVertexArrayObject: vaoExt.deleteVertexArrayOES.bind(gl),
        bindVertexArrayObject: vaoExt.bindVertexArrayOES.bind(gl),
      };
      this.drawBuffers = {
        COLOR_ATTACHMENT0: drawBuffersExt.COLOR_ATTACHMENT0_WEBGL,
        COLOR_ATTACHMENT1: drawBuffersExt.COLOR_ATTACHMENT1_WEBGL,
        COLOR_ATTACHMENT10: drawBuffersExt.COLOR_ATTACHMENT10_WEBGL,
        COLOR_ATTACHMENT11: drawBuffersExt.COLOR_ATTACHMENT11_WEBGL,
        COLOR_ATTACHMENT12: drawBuffersExt.COLOR_ATTACHMENT12_WEBGL,
        COLOR_ATTACHMENT13: drawBuffersExt.COLOR_ATTACHMENT13_WEBGL,
        COLOR_ATTACHMENT14: drawBuffersExt.COLOR_ATTACHMENT14_WEBGL,
        COLOR_ATTACHMENT15: drawBuffersExt.COLOR_ATTACHMENT15_WEBGL,
        COLOR_ATTACHMENT2: drawBuffersExt.COLOR_ATTACHMENT2_WEBGL,
        COLOR_ATTACHMENT3: drawBuffersExt.COLOR_ATTACHMENT3_WEBGL,
        COLOR_ATTACHMENT4: drawBuffersExt.COLOR_ATTACHMENT4_WEBGL,
        COLOR_ATTACHMENT5: drawBuffersExt.COLOR_ATTACHMENT5_WEBGL,
        COLOR_ATTACHMENT6: drawBuffersExt.COLOR_ATTACHMENT6_WEBGL,
        COLOR_ATTACHMENT7: drawBuffersExt.COLOR_ATTACHMENT7_WEBGL,
        COLOR_ATTACHMENT8: drawBuffersExt.COLOR_ATTACHMENT8_WEBGL,
        COLOR_ATTACHMENT9: drawBuffersExt.COLOR_ATTACHMENT9_WEBGL,
        DRAW_BUFFER0: drawBuffersExt.DRAW_BUFFER0_WEBGL,
        DRAW_BUFFER1: drawBuffersExt.DRAW_BUFFER1_WEBGL,
        DRAW_BUFFER10: drawBuffersExt.DRAW_BUFFER10_WEBGL,
        DRAW_BUFFER11: drawBuffersExt.DRAW_BUFFER11_WEBGL,
        DRAW_BUFFER12: drawBuffersExt.DRAW_BUFFER12_WEBGL,
        DRAW_BUFFER13: drawBuffersExt.DRAW_BUFFER13_WEBGL,
        DRAW_BUFFER14: drawBuffersExt.DRAW_BUFFER14_WEBGL,
        DRAW_BUFFER15: drawBuffersExt.DRAW_BUFFER15_WEBGL,
        DRAW_BUFFER2: drawBuffersExt.DRAW_BUFFER2_WEBGL,
        DRAW_BUFFER3: drawBuffersExt.DRAW_BUFFER3_WEBGL,
        DRAW_BUFFER4: drawBuffersExt.DRAW_BUFFER4_WEBGL,
        DRAW_BUFFER5: drawBuffersExt.DRAW_BUFFER5_WEBGL,
        DRAW_BUFFER6: drawBuffersExt.DRAW_BUFFER6_WEBGL,
        DRAW_BUFFER7: drawBuffersExt.DRAW_BUFFER7_WEBGL,
        DRAW_BUFFER8: drawBuffersExt.DRAW_BUFFER8_WEBGL,
        DRAW_BUFFER9: drawBuffersExt.DRAW_BUFFER9_WEBGL,
        MAX_COLOR_ATTACHMENTS: drawBuffersExt.MAX_COLOR_ATTACHMENTS_WEBGL,
        MAX_DRAW_BUFFERS: drawBuffersExt.MAX_DRAW_BUFFERS_WEBGL,
        drawBuffers: drawBuffersExt.drawBuffersWEBGL.bind(gl),
      };
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.cullFace(gl.BACK);
  }

  public static fromCanvas(canvas: HTMLCanvasElement, debug = false): WebGL {
    const attrs = {
      antialias: false,
      depth: true,
      desynchronized: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      stencil: false,
    } satisfies WebGLContextAttributes;
    const gl =
      (canvas.getContext("webgl2", attrs) as WebGL2RenderingContext) ||
      (canvas.getContext(
        "experimental-webgl2",
        attrs,
      ) as WebGL2RenderingContext) ||
      (canvas.getContext("webgl", attrs) as WebGLRenderingContext) ||
      (canvas.getContext("experimental-webgl", attrs) as WebGLRenderingContext);

    if (gl === null) {
      throw new Error("Unable to initialize WebGL");
    }

    return new WebGL(gl, debug);
  }

  private static getRequiredExtension<T extends WebGLExtension>(
    gl: WebGLRenderingContext,
    extension: T,
  ): WebGLExtensionMap[T] {
    const ext = gl.getExtension(extension) as WebGLExtensionMap[T] | null;

    if (ext === null) {
      throw new Error(
        `Failed to initialize WebGL: '${extension}' extension not supported`,
      );
    }

    return ext;
  }

  private static getOptionalExtension<T extends WebGLExtension>(
    gl: WebGLRenderingContext,
    extension: T,
  ): WebGLExtensionMap[T] | null {
    return gl.getExtension(extension) as WebGLExtensionMap[T] | null;
  }

  public clear(color = new Rgba(255, 127, 127, 1)): void {
    const { gl } = this;
    gl.clearColor(color.r / 255, color.g / 255, color.b / 255, color.a);
    gl.colorMask(true, true, true, true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public updateViewport(): void {
    const { gl } = this;
    gl.viewport(
      0,
      0,
      gl.canvas.width * devicePixelRatio,
      gl.canvas.height * devicePixelRatio,
    );
  }

  public createGBuffer(): WebGLGBuffer {
    const { gl, drawBuffers } = this;

    const framebuffer = this.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    const position = this.createRenderTarget();
    gl.bindTexture(gl.TEXTURE_2D, position);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      drawBuffers.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      position,
      0,
    );

    const normal = this.createRenderTarget();
    gl.bindTexture(gl.TEXTURE_2D, normal);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      drawBuffers.COLOR_ATTACHMENT1,
      gl.TEXTURE_2D,
      normal,
      0,
    );

    const color = this.createRenderTarget();
    gl.bindTexture(gl.TEXTURE_2D, color);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      drawBuffers.COLOR_ATTACHMENT2,
      gl.TEXTURE_2D,
      color,
      0,
    );

    const depth = this.createRenderTarget();
    gl.bindTexture(gl.TEXTURE_2D, depth);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      depth,
      0,
    );

    drawBuffers.drawBuffers([
      drawBuffers.COLOR_ATTACHMENT0,
      drawBuffers.COLOR_ATTACHMENT1,
      drawBuffers.COLOR_ATTACHMENT2,
    ]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return { framebuffer, position, normal, color, depth };
  }

  public createFramebuffer(): WebGLFramebuffer {
    const { gl } = this;
    const fb = gl.createFramebuffer();

    if (fb === null) {
      const error = gl.getError();
      throw new Error(`Failed to create frame buffer: ${error}`);
    }

    if (this.debug) {
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Failed to create frame buffer: ${status}`);
      }
    }

    return fb;
  }

  public createRenderBuffer(): WebGLRenderbuffer {
    const { gl } = this;
    const rb = gl.createRenderbuffer();

    if (rb === null) {
      const error = gl.getError();
      throw new Error(`Failed to create render buffer: ${error}`);
    }

    return rb;
  }

  public createVertexArrayObject(
    indexBuffer: WebGLIndexBuffer,
    vertexBuffers: [GLuint, WebGLVertexBuffer][],
  ): WebGLVertexArrayObject {
    const { gl, vertexArrayObject } = this;

    const vao = vertexArrayObject.createVertexArrayObject();

    if (vao === null) {
      const error = gl.getError();
      throw new Error(`Failed to create vertex array object: ${error}`);
    }

    vertexArrayObject.bindVertexArrayObject(vao);

    for (const [attribLocation, vertexBuffer] of vertexBuffers) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer);
      gl.enableVertexAttribArray(attribLocation);
      gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);

    vertexArrayObject.bindVertexArrayObject(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vao;
  }

  public createVertexBuffer(
    vertices: ArrayBuffer | ArrayBufferView,
  ): WebGLVertexBuffer {
    const { gl } = this;
    const buffer = gl.createBuffer();

    if (buffer === null) {
      const error = gl.getError();
      throw new Error(`Failed to create vertex buffer: ${error}`);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // TODO may be dynamic
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return { buffer, size: vertices.byteLength };
  }

  // TODO unused?
  public bindBuffer(buffer: WebGLBuffer, location: GLuint, size: GLint): void {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public createIndexBuffer(
    indices: ArrayBuffer | ArrayBufferView,
  ): WebGLIndexBuffer {
    const { gl } = this;
    const buffer = gl.createBuffer();

    if (buffer === null) {
      const error = gl.getError();
      throw new Error(`Failed to create index buffer: ${error}`);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW); // May be dynamic
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    let type;
    if (indices.byteLength < 256) {
      type = WebGLIndexBufferType.UNSIGNED_BYTE;
    } else if (indices.byteLength < 65536) {
      type = WebGLIndexBufferType.UNSIGNED_SHORT;
    } else {
      type = WebGLIndexBufferType.UNSIGNED_INT;
    }

    return { buffer, type };
  }

  public createRenderTarget(): WebGLTexture {
    const { gl } = this;

    return this.createTextureFromPixels(
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    );
  }

  public createTextureFromPixels(
    width: number,
    height: number,
    pixels: ArrayBufferView | null = null,
  ): WebGLTexture {
    const { gl } = this;
    const texture = gl.createTexture();

    if (texture === null) {
      const error = gl.getError();
      throw new Error(`Failed to create texture: ${error}`);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }

  public createTextureFromSource(
    source:
      | ImageBitmap
      | ImageData
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement
      | OffscreenCanvas,
  ): WebGLTexture {
    const { gl, isWebGL2 } = this;
    const texture = gl.createTexture();

    if (texture === null) {
      const error = gl.getError();
      throw new Error(`Failed to create texture: ${error}`);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    if (isWebGL2 || (isPowerOf2(source.width) && isPowerOf2(source.height))) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }

  public createShader<T extends string, U extends string>(
    vsSource: string,
    fsSource: string,
    attributes: T[],
    uniforms: U[],
  ): {
    program: WebGLProgram;
    attribLocation: Record<T, GLint>;
    uniformLocation: Record<U, WebGLUniformLocation>;
  } {
    const vs = this.compileShader(vsSource, WebGLShaderType.VERTEX);
    const fs = this.compileShader(fsSource, WebGLShaderType.FRAGMENT);
    const program = this.createProgram(vs, fs);

    return {
      program,
      attribLocation: Object.fromEntries(
        attributes.map((name) => [name, this.getAttribLocation(program, name)]),
      ) as Record<T, GLint>,
      uniformLocation: Object.fromEntries(
        uniforms.map((name) => [name, this.getUniformLocation(program, name)]),
      ) as Record<U, WebGLUniformLocation>,
    };
  }

  public draw(mode: WebGLDrawMode, elements: number): void {
    const { gl } = this;
    // TODO
  }

  private createProgram(
    vShader: WebGLShader,
    fShader: WebGLShader,
  ): WebGLProgram {
    const { gl } = this;
    const program = gl.createProgram();

    if (program === null) {
      const error = gl.getError();
      throw new Error(`Failed to create program: ${error}`);
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    // Eagerly delete shaders since we won't access them anymore
    gl.detachShader(program, vShader);
    gl.detachShader(program, fShader);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);

    if (this.debug) {
      gl.validateProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Failed to link program: ${info}`);
      }
    }

    return program;
  }

  private compileShader(source: string, type: WebGLShaderType): WebGLShader {
    const { gl } = this;
    const shader = gl.createShader(type);

    if (shader === null) {
      const error = gl.getError();
      throw new Error(`Failed to create shader: ${error}`);
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (this.debug && !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Failed to compile shader: ${info}`);
    }

    return shader;
  }

  private getAttribLocation(program: WebGLProgram, name: string): GLint {
    const { gl } = this;
    const location = gl.getAttribLocation(program, name);

    if (location === -1) {
      throw new Error(`Failed to find attrib location for '${name}'`);
    }

    return location;
  }

  private getUniformLocation(
    program: WebGLProgram,
    name: string,
  ): WebGLUniformLocation {
    const { gl } = this;
    const location = gl.getUniformLocation(program, name);

    if (location === null) {
      throw new Error(`Failed to find uniform location for '${name}'`);
    }

    return location;
  }
}

export class WebGLRenderer implements System {
  constructor(private readonly gl: WebGL) {}

  public init(scene: Scene): void {
    const { gl } = this;
    gl.updateViewport();
    const gBuffer = gl.createGBuffer();
    const shader = gl.createShader(
      `
      #version 100

      attribute vec3 aPosition;
      attribute vec3 aColor;

//      uniform mat4 uModelViewMatrix;
//      uniform mat4 uProjectionMatrix;

      varying lowp vec3 vColor;

      void main(void) {
        vColor = aColor;
        gl_Position = vec4(aPosition, 1.0);
      }`,
      `
      #version 100
      
      precision mediump float;

      varying vec3 vColor;

      void main(void) {
        gl_FragColor = vec4(vColor, 1.0);
      }
      `,
      ["aPosition", "aColor"],
      [],
    );
    const { aPosition, aColor } = shader.attribLocation;
    const vertexBuffer = gl.createVertexBuffer(
      Float32Array.from(Triangle.vertices.flatMap((v) => [v.x, v.x, v.y, v.z])),
    );
    const colorBuffer = gl.createVertexBuffer(
      Float32Array.from([
        // eslint-disable-next-line prettier/prettier
        1.0, 0.0, 0.0, // Red
        // eslint-disable-next-line prettier/prettier
        0.0, 1.0, 0.0, // Green
        // eslint-disable-next-line prettier/prettier
        0.0, 0.0, 1.0, // Blue
      ]),
    );
    const indexBuffer = gl.createIndexBuffer(new Uint8Array([0, 1, 2]));
    const vertexArrayObject = gl.createVertexArrayObject(indexBuffer, [
      [aPosition, vertexBuffer],
      [aColor, colorBuffer],
    ]);
  }

  public update({ entities }: Scene, _dt: number): void {
    const { gl } = this;
    const a: WebGLRenderingContext = null!;

    gl.clear();

    // a.useProgram(program);
    //
    // a.bindBuffer(a.ARRAY_BUFFER, vertexBuffer);
    // a.vertexAttribPointer(location, 3, a.FLOAT, false, 4 * 3, 0);
    // a.enableVertexAttribArray(location);
    //
    // a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // a.drawElements(a.TRIANGLES, 3, a.UNSIGNED_SHORT, 0);
  }
}
