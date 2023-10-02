export class Profiler {
  private static start_times: Map<string, number> = new Map<string,number>();

  static Start(ref: string) {
    this.start_times.set(ref, new Date().getTime());
  }

  static Stop(ref: string) {
    const start_time = this.start_times.get(ref);
    if (start_time) {
      const end_time = new Date().getTime();
      console.info(`${ref} duration ${end_time - start_time}ms`);
      this.start_times.delete(ref);
    }
  }
}
