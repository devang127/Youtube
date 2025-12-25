import PrimaryButton from "./PrimaryButton";

const ErrorPage = () => {
  return (
    <>
      <section className="error-page">
        <div className="container">
          <div className="row justify-content-center h-100">
            <div className="col-lg-6 flex-column d-flex align-items-center justify-content-center">
              <div className="card flex-column d-flex align-items-center justify-content-center border-0">
                <h1 className="text-center">404</h1>
                <h4>Page not found</h4>
                <p className="pt-2">The page you're looking for doesn't exist or has been moved.</p>
                <div className="mt-3">
                  <PrimaryButton to="/" text="Home page"></PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorPage;
