const makeRandomlyStreamingDataSource = () => ({
  start: () => {
    setInterval(() => {
      return 666;
    }, 1000);
  },
  stop: () => {},
});

export default makeRandomlyStreamingDataSource;
